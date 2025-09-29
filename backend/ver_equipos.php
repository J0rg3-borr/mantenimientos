<?php
include 'db.php';

$sql = "SELECT * FROM equipos";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table border='1'>
            <tr>
                <th>ID</th><th>Cliente</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Estado</th><th>Disco</th><th>RAM</th><th>Observaciones</th>
            </tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['id']}</td>
                <td>{$row['cliente']}</td>
                <td>{$row['tipo_equipo']}</td>
                <td>{$row['marca']}</td>
                <td>{$row['modelo']}</td>
                <td>{$row['estado_fisico']}</td>
                <td>{$row['capacidad_disco']} GB</td>
                <td>{$row['ram']} GB</td>
                <td>{$row['observaciones']}</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "No hay registros.";
}

$conn->close();
?>
