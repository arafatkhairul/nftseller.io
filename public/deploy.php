<?php
// ১. কনফিগারেশন
$secret = '@khairulmeeeA'; // গিটহাবে যে সিক্রেট দিয়েছেন, সেটা এখানে দিন
$base_dir = '/home/nftseller/public_html'; // আপনার প্রজেক্ট ফোল্ডার

// ২. লগ ফাইল তৈরি (যদি কোনো সমস্যা হয় দেখার জন্য)
$logFile = 'deploy_log.txt';

// ৩. সিকিউরিটি চেক (GitHub থেকে রিকোয়েস্ট এসেছে কিনা)
$headers = getallheaders();
$hubSignature = $headers['X-Hub-Signature-256'] ?? $headers['x-hub-signature-256'] ?? '';
$payload = file_get_contents('php://input');

// লগিং ফাংশন
function writeLog($text) {
    global $logFile;
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $text . "\n", FILE_APPEND);
}

writeLog("Webhook Triggered.");

if ($secret) {
    if (!$hubSignature) {
        writeLog("Error: No Signature.");
        http_response_code(403);
        die('No Signature');
    }
    list($algo, $hash) = explode('=', $hubSignature, 2);
    if (!hash_equals($hash, hash_hmac('sha256', $payload, $secret))) {
        writeLog("Error: Invalid Secret.");
        http_response_code(403);
        die('Invalid Secret');
    }
}

// ৪. কমান্ড রান করা
// Laravel এর জন্য প্রয়োজনীয় কমান্ডগুলো
$commands = [
    'echo "Deployment Started..."',
    "cd {$base_dir} && /usr/bin/git pull origin main 2>&1",
    "cd {$base_dir} && /usr/local/bin/php artisan migrate --force 2>&1",
    "cd {$base_dir} && /usr/local/bin/php artisan optimize:clear 2>&1",
    "cd {$base_dir} && /usr/local/bin/php artisan config:cache 2>&1",
    'echo "Deployment Finished!"'
];

$output = '';
foreach ($commands as $command) {
    $tmp = shell_exec($command);
    $output .= "$ {$command}\n" . htmlentities(trim($tmp)) . "\n\n";
    writeLog("Executed: " . $command);
}

writeLog("Deployment Successful.");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Deployment Status</title>
    <style>body{background:#1a1a1a;color:#4ade80;font-family:monospace;padding:20px;}pre{white-space:pre-wrap;}</style>
</head>
<body>
    <h3>Deployment Log:</h3>
    <pre><?php echo $output; ?></pre>
</body>
</html>