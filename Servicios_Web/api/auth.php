<?php
/**
 * Authentication API Endpoint
 * Login and user management
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../database/connection.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();
$conn = $db->getConnection();

// Generate JWT token (simplified version)
function generateToken($user) {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode([
        'id' => $user['id'],
        'nombre_usuario' => $user['nombre_usuario'],
        'rol' => $user['rol'],
        'exp' => time() + (60 * 60 * 24) // 24 hours
    ]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", 'buildx_secret_key', true));
    return "$header.$payload.$signature";
}

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? 'login';
        $data = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'login') {
            // Login
            if (!isset($data['nombre_usuario']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Usuario y contraseña requeridos'
                ]);
                break;
            }
            
            $nombre_usuario = $data['nombre_usuario'];
            $password = $data['password'];
            
            $query = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1";
            $stmt = $conn->prepare($query);
            $stmt->execute([$nombre_usuario]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $token = generateToken($user);
                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'nombre_usuario' => $user['nombre_usuario'],
                        'email' => $user['email'],
                        'rol' => $user['rol']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Credenciales inválidas'
                ]);
            }
        } elseif ($action === 'register') {
            // Register new user
            if (!isset($data['nombre_usuario']) || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Datos incompletos'
                ]);
                break;
            }
            
            $nombre_usuario = $data['nombre_usuario'];
            $email = $data['email'];
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $rol = $data['rol'] ?? 'usuario';
            
            // Check if user already exists
            $checkQuery = "SELECT * FROM usuarios WHERE nombre_usuario = ? OR email = ?";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->execute([$nombre_usuario, $email]);
            
            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'error' => 'Usuario o email ya existe'
                ]);
                break;
            }
            
            $query = "INSERT INTO usuarios (nombre_usuario, email, password, rol) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            
            if ($stmt->execute([$nombre_usuario, $email, $password, $rol])) {
                $userId = $conn->lastInsertId();
                $user = [
                    'id' => $userId,
                    'nombre_usuario' => $nombre_usuario,
                    'email' => $email,
                    'rol' => $rol
                ];
                
                $token = generateToken($user);
                
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Usuario registrado exitosamente',
                    'token' => $token,
                    'user' => $user
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Error al registrar el usuario'
                ]);
            }
        } elseif ($action === 'verify') {
            // Verify token
            $token = $data['token'] ?? '';
            
            if (empty($token)) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Token requerido'
                ]);
                break;
            }
            
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Token inválido'
                ]);
                break;
            }
            
            $payload = json_decode(base64_decode($parts[1]), true);
            
            if ($payload && isset($payload['exp']) && $payload['exp'] > time()) {
                echo json_encode(['success' => true, 'valid' => true, 'user' => $payload]);
            } else {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Token expirado'
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Acción no válida'
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido'
        ]);
        break;
}
