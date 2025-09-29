<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$cliente = $data['cliente'];
$tipo_equipo = $data['tipo_equipo'];
$marca = $data['marca'];
$modelo = $data['modelo'];
$estado_fisico = $data['estado_fisico'];
$capacidad_disco = $data['capacidad_disco'];
$ram = $data['ram'];
$observaciones = $data['observaciones'];

$sql = "INSERT INTO equipos (cliente, tipo_equipo, marca, modelo, estado_fisico, capacidad_disco, ram, observaciones)
        VALUES ('$cliente', '$tipo_equipo', '$marca', '$modelo', '$estado_fisico', '$capacidad_disco', '$ram', '$observaciones')";

if ($conn->query($sql) === TRUE) {
    echo "Registro guardado exitosamente";
} else {
    echo "Error: " . $conn->error;
}
