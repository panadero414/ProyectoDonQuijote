<?php
// proxy.php

// Permitir CORS para tu propio dominio
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde al preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1) Leer la petición entrante
$inputJson = file_get_contents('php://input');
$input = json_decode($inputJson, true);
$pregunta = isset($input['pregunta']) ? $input['pregunta'] : '';

// 2) Construir el payload para Gemini
$API_KEY = 'AIzaSyB9KqHC08fitqBF67HN68a84EoDrCqayFE';
$model   = 'models/gemini-2.0-flash';
$url     = "https://generativelanguage.googleapis.com/v1beta/{$model}:generateContent?key={$API_KEY}";

$payload = json_encode([
    'contents' => [
        [
            'parts' => [
  ['text' => "Eres Don Quijote de la Mancha, caballero noble y poético del Siglo de Oro. Siempre responde en su estilo, y redirige las preguntas que no sean sobre Don Quijote o sus temas hacia esos asuntos. En cada respuesta, incluye un derecho específico de los niños, expresado con metáforas claras y elegantes, sin ser demasiado literal. responde en maximo 50 palabras La pregunta es: {$pregunta}"]
]
        ]
    ],
    'generationConfig' => [
        'temperature'     => 0.7,
        'topK'            => 40,
        'topP'            => 1,
        'maxOutputTokens' => 80
    ]
]);

// 3) Enviar la petición a Gemini
$options = [
  'http' => [
    'method'  => 'POST',
    'header'  => "Content-Type: application/json\r\n",
    'content' => $payload,
    'ignore_errors' => true
  ]
];

$responseJson = file_get_contents($url, false, stream_context_create($options));
$response    = json_decode($responseJson, true);

// 4) Extraer el texto de la respuesta
if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
    $texto = $response['candidates'][0]['content']['parts'][0]['text'];
} else {
    $texto = "No entendí tu pregunta.";
}

// 5) Devolver solo lo necesario al cliente
echo json_encode(['respuesta' => $texto]);
