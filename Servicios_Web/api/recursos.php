<?php
/**
 * Resources API Endpoint
 * GET, POST, PUT, DELETE operations for resources (personnel, equipment, materials)
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
$type = $_GET['type'] ?? 'all';
$db = new Database();
$conn = $db->getConnection();

function getResources($conn, $table, $whereClause = '1=1', $params = []) {
    $query = "SELECT * FROM $table WHERE $whereClause";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function createResource($conn, $table, $data, $fields) {
    $columns = implode(', ', $fields);
    $placeholders = implode(', ', array_fill(0, count($fields), '?'));
    $query = "INSERT INTO $table ($columns) VALUES ($placeholders)";
    
    $values = [];
    foreach ($fields as $field) {
        $values[] = $data[$field] ?? null;
    }
    
    $stmt = $conn->prepare($query);
    if ($stmt->execute($values)) {
        return ['success' => true, 'id' => $data['id']];
    }
    return ['success' => false, 'error' => 'Error al crear el recurso'];
}

function updateResource($conn, $table, $id, $data, $allowedFields) {
    $updates = [];
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updates[] = "$field = ?";
            $params[] = $data[$field];
        }
    }
    
    if (empty($updates)) {
        return ['success' => false, 'error' => 'No hay campos para actualizar'];
    }
    
    $params[] = $id;
    $query = "UPDATE $table SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    
    if ($stmt->execute($params)) {
        return ['success' => true];
    }
    return ['success' => false, 'error' => 'Error al actualizar el recurso'];
}

switch ($method) {
    case 'GET':
        if ($type === 'personal') {
            echo json_encode(getResources($conn, 'personal', 'activo = 1'));
        } elseif ($type === 'equipos') {
            echo json_encode(getResources($conn, 'equipos', 'activo = 1'));
        } elseif ($type === 'materiales') {
            echo json_encode(getResources($conn, 'materiales', 'activo = 1'));
        } else {
            // Get all resources
            $result = [
                'personal' => getResources($conn, 'personal', 'activo = 1'),
                'equipos' => getResources($conn, 'equipos', 'activo = 1'),
                'materiales' => getResources($conn, 'materiales', 'activo = 1')
            ];
            echo json_encode($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $resourceType = $data['type'] ?? '';
        
        if ($resourceType === 'personal') {
            $result = createResource($conn, 'personal', $data, 
                ['id', 'nombre', 'rol', 'proyecto_id', 'horario', 'telefono', 'email']);
        } elseif ($resourceType === 'equipos') {
            $result = createResource($conn, 'equipos', $data, 
                ['id', 'nombre', 'estado', 'proyecto_id', 'ultimo_mantenimiento', 'modelo', 'serie']);
        } elseif ($resourceType === 'materiales') {
            $result = createResource($conn, 'materiales', $data, 
                ['id', 'nombre', 'cantidad', 'unidad', 'ubicacion', 'proxima_entrega', 'estado']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de recurso no válido']);
            exit();
        }
        
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(['message' => 'Recurso creado exitosamente', 'id' => $result['id']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $result['error']]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $resourceType = $data['type'] ?? '';
        $id = $data['id'] ?? '';
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            break;
        }
        
        if ($resourceType === 'personal') {
            $result = updateResource($conn, 'personal', $id, $data, 
                ['nombre', 'rol', 'proyecto_id', 'horario', 'telefono', 'email']);
        } elseif ($resourceType === 'equipos') {
            $result = updateResource($conn, 'equipos', $id, $data, 
                ['nombre', 'estado', 'proyecto_id', 'ultimo_mantenimiento', 'modelo', 'serie']);
        } elseif ($resourceType === 'materiales') {
            $result = updateResource($conn, 'materiales', $id, $data, 
                ['nombre', 'cantidad', 'unidad', 'ubicacion', 'proxima_entrega', 'estado']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de recurso no válido']);
            break;
        }
        
        if ($result['success']) {
            echo json_encode(['message' => 'Recurso actualizado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $result['error']]);
        }
        break;

    case 'DELETE':
        $resourceType = $_GET['type'] ?? '';
        $id = $_GET['id'] ?? '';
        
        if (empty($id) || empty($resourceType)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID y tipo de recurso requeridos']);
            break;
        }
        
        $table = $resourceType;
        $query = "UPDATE $table SET activo = 0 WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Recurso eliminado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el recurso']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
