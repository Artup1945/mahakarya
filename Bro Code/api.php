<?
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Konfigurasi Database MySQL
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'db_portofolio';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Koneksi database gagal']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Ambil semua pesan urut dari yang terbaru
    $result = $conn->query("SELECT * FROM messages ORDER BY created_at DESC");
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            'id' => (int)$row['id'],
            'nama' => $row['nama'],
            'pesan' => $row['pesan'],
            'rating' => (int)$row['rating'],
            'createdAt' => $row['created_at']
        ];
    }
    echo json_encode($messages);
} 

elseif ($method === 'POST') {
    // Simpan pesan baru
    $data = json_decode(file_get_contents('php://input'), true);
    $nama = $conn->real_escape_string($data['nama'] ?? '');
    $pesan = $conn->real_escape_string($data['pesan'] ?? '');
    $rating = (int)($data['rating'] ?? 0);

    if (!empty($nama) && !empty($pesan) && $rating > 0) {
        $sql = "INSERT INTO messages (nama, pesan, rating) VALUES ('$nama', '$pesan', $rating)";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['error' => 'Gagal menyimpan data']);
        }
    } else {
        echo json_encode(['error' => 'Data tidak lengkap']);
    }
} 

elseif ($method === 'DELETE') {
    // Hapus pesan berdasarkan ID
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id > 0) {
        $conn->query("DELETE FROM messages WHERE id = $id");
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'ID tidak valid']);
    }
}

$conn->close();
?>