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

// Helper: sanitize user output (no password)
function sanitizeUser($user) {
    if (!$user) return null;
    return [
        'id' => $user['id'],
        'nombre_usuario' => $user['nombre_usuario'],
        'email' => $user['email'],
        'rol' => $user['rol'],
        'activo' => isset($user['activo']) ? (int)$user['activo'] : 1,
        'fecha_creacion' => $user['fecha_creacion'] ?? null
    ];
}

// Helper: get JSON body safely
function getJsonInput() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? 'login';
        $data = getJsonInput();
        
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
            
            if ($user && $password === $user['password']) {
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
            $password = $data['password'];
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

    case 'GET':
        // User listing and retrieval
        $action = $_GET['action'] ?? 'users';

        if ($action !== 'users') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Acción no válida para GET'
            ]);
            break;
        }

        $id = $_GET['id'] ?? null;
        $rol = $_GET['rol'] ?? null;

        if ($id !== null) {
            // Get single user by ID
            $query = "SELECT id, nombre_usuario, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if ($user) {
                echo json_encode(sanitizeUser($user));
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Usuario no encontrado'
                ]);
            }
        } else {
            // Get users list (optionally filtered by rol)
            if ($rol !== null) {
                $query = "SELECT id, nombre_usuario, email, rol, activo, fecha_creacion FROM usuarios WHERE rol = ?";
                $stmt = $conn->prepare($query);
                $stmt->execute([$rol]);
            } else {
                $query = "SELECT id, nombre_usuario, email, rol, activo, fecha_creacion FROM usuarios";
                $stmt = $conn->prepare($query);
                $stmt->execute();
            }

            $users = $stmt->fetchAll();
            $result = [];
            foreach ($users as $u) {
                $result[] = sanitizeUser($u);
            }
            echo json_encode($result);
        }
        break;

    case 'PUT':
        // Update user
        $action = $_GET['action'] ?? 'update';
        if ($action !== 'update') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Acción no válida para PUT'
            ]);
            break;
        }

        $data = getJsonInput();

        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID de usuario requerido'
            ]);
            break;
        }

        $id = $data['id'];

        // Fetch existing user
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ]);
            break;
        }

        $fields = [];
        $params = [];

        // Allowed updatable fields
        $allowed = ['nombre_usuario', 'email', 'rol', 'password', 'activo'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'No se proporcionaron campos para actualizar'
            ]);
            break;
        }

        // Check for duplicate username/email if changed
        if (isset($data['nombre_usuario']) || isset($data['email'])) {
            $checkQuery = "SELECT * FROM usuarios WHERE (nombre_usuario = ? OR email = ?) AND id != ?";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->execute([
                $data['nombre_usuario'] ?? $existing['nombre_usuario'],
                $data['email'] ?? $existing['email'],
                $id
            ]);

            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode([
                    'success' => false,
                    'error' => 'El nombre de usuario o email ya está en uso'
                ]);
                break;
            }
        }

        $params[] = $id;
        $query = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = ?";
        $updateStmt = $conn->prepare($query);

        if ($updateStmt->execute($params)) {
            // Return updated user without password
            $stmt = $conn->prepare("SELECT id, nombre_usuario, email, rol, activo, fecha_creacion FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $updated = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'user' => sanitizeUser($updated)
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Error al actualizar el usuario'
            ]);
        }
        break;

    case 'DELETE':
        // Soft delete user (set activo = 0)
        $action = $_GET['action'] ?? 'delete';
        if ($action !== 'delete') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Acción no válida para DELETE'
            ]);
            break;
        }

        $id = $_GET['id'] ?? null;
        if ($id === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID de usuario requerido'
            ]);
            break;
        }

        // Prevent deleting main admin (id = 1 or nombre_usuario = admin)
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Usuario no encontrado'
            ]);
            break;
        }

        if ((int)$user['id'] === 1 || $user['nombre_usuario'] === 'admin') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'No se puede eliminar el usuario administrador principal'
            ]);
            break;
        }

        $deleteStmt = $conn->prepare("UPDATE usuarios SET activo = 0 WHERE id = ?");
        if ($deleteStmt->execute([$id])) {
            echo json_encode([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Error al eliminar el usuario'
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
