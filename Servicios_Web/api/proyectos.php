<?php
/**
 * Projects API Endpoint
 * GET, POST, PUT, DELETE operations for projects
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../database/connection.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();
$conn = $db->getConnection();

switch ($method) {
    case 'GET':
        // Get all projects or single project
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM proyectos WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$id]);
            $project = $stmt->fetch();
            
            if ($project) {
                echo json_encode($project);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Proyecto no encontrado']);
            }
        } else {
            // Get all projects
            $statusFilter = isset($_GET['status']) ? $_GET['status'] : '';
            $searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
            
            $query = "SELECT * FROM proyectos WHERE 1=1";
            $params = [];
            
            if (!empty($statusFilter)) {
                $query .= " AND estado = ?";
                $params[] = $statusFilter;
            }
            
            if (!empty($searchTerm)) {
                $query .= " AND (nombre LIKE ? OR ubicacion LIKE ?)";
                $searchParam = "%$searchTerm%";
                $params[] = $searchParam;
                $params[] = $searchParam;
            }
            
            $query .= " ORDER BY fecha_creacion DESC";
            
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $projects = $stmt->fetchAll();
            
            echo json_encode($projects);
        }
        break;

    case 'POST':
        // Create new project
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['ubicacion']) || !isset($data['fecha_inicio'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            break;
        }
        
        $id = $data['id'];
        $nombre = $data['nombre'];
        $ubicacion = $data['ubicacion'];
        $fecha_inicio = $data['fecha_inicio'];
        $descripcion = $data['descripcion'] ?? '';
        $progreso = $data['progreso'] ?? 0;
        $estado = $data['estado'] ?? 'active';
        
        $query = "INSERT INTO proyectos (id, nombre, ubicacion, fecha_inicio, descripcion, progreso, estado) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$id, $nombre, $ubicacion, $fecha_inicio, $descripcion, $progreso, $estado])) {
            http_response_code(201);
            echo json_encode(['message' => 'Proyecto creado exitosamente', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el proyecto']);
        }
        break;

    case 'PUT':
        // Update project
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de proyecto requerido']);
            break;
        }
        
        $id = $data['id'];
        $nombre = $data['nombre'] ?? null;
        $ubicacion = $data['ubicacion'] ?? null;
        $progreso = $data['progreso'] ?? null;
        $estado = $data['estado'] ?? null;
        $descripcion = $data['descripcion'] ?? null;
        
        $updates = [];
        $params = [];
        
        if ($nombre !== null) { $updates[] = "nombre = ?"; $params[] = $nombre; }
        if ($ubicacion !== null) { $updates[] = "ubicacion = ?"; $params[] = $ubicacion; }
        if ($progreso !== null) { $updates[] = "progreso = ?"; $params[] = $progreso; }
        if ($estado !== null) { $updates[] = "estado = ?"; $params[] = $estado; }
        if ($descripcion !== null) { $updates[] = "descripcion = ?"; $params[] = $descripcion; }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No hay campos para actualizar']);
            break;
        }
        
        $params[] = $id;
        $query = "UPDATE proyectos SET " . implode(', ', $updates) . " WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode(['message' => 'Proyecto actualizado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el proyecto']);
        }
        break;

    case 'DELETE':
        // Delete project
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de proyecto requerido']);
            break;
        }
        
        $id = $_GET['id'];
        $query = "DELETE FROM proyectos WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Proyecto eliminado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el proyecto']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
