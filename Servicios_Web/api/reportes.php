<?php
/**
 * Reports API Endpoint
 * GET, POST operations for reports
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM reportes WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$id]);
            $report = $stmt->fetch();
            
            if ($report) {
                echo json_encode($report);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Reporte no encontrado']);
            }
        } else {
            // Get all reports
            $typeFilter = isset($_GET['type']) ? $_GET['type'] : '';
            $dateFrom = isset($_GET['dateFrom']) ? $_GET['dateFrom'] : '';
            $dateTo = isset($_GET['dateTo']) ? $_GET['dateTo'] : '';
            
            $query = "SELECT * FROM reportes WHERE 1=1";
            $params = [];
            
            if (!empty($typeFilter)) {
                $query .= " AND tipo = ?";
                $params[] = $typeFilter;
            }
            
            if (!empty($dateFrom)) {
                $query .= " AND fecha >= ?";
                $params[] = $dateFrom;
            }
            
            if (!empty($dateTo)) {
                $query .= " AND fecha <= ?";
                $params[] = $dateTo;
            }
            
            $query .= " ORDER BY fecha DESC";
            
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $reports = $stmt->fetchAll();
            
            echo json_encode($reports);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['tipo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            break;
        }
        
        $id = $data['id'];
        $nombre = $data['nombre'];
        $tipo = $data['tipo'];
        $fecha = $data['fecha'] ?? date('Y-m-d');
        
        $query = "INSERT INTO reportes (id, nombre, tipo, fecha) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$id, $nombre, $tipo, $fecha])) {
            http_response_code(201);
            echo json_encode(['message' => 'Reporte creado exitosamente', 'id' => $id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el reporte']);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de reporte requerido']);
            break;
        }
        
        $id = $_GET['id'];
        $query = "DELETE FROM reportes WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Reporte eliminado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el reporte']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
