<?php

$starttime = microtime(true);

require '../../../vendor/autoload.php';

use Aptoma\Twig\Extension\MarkdownExtension;
use Aptoma\Twig\Extension\MarkdownEngine;

// Globals
$globals = json_decode(file_get_contents('./globals.json'), true);
$globals['version'] = microtime(true);

// Local overrides
$localFile = __DIR__ . './local.json';
if (file_exists($localFile)) {
  $local = json_decode(file_get_contents('./local.json'), true);
  $globals = array_merge($globals, $local);
}

// Header data
$header = json_decode(file_get_contents('./../components/header/data/default.json'), true);

// Footer data
$footer = json_decode(file_get_contents('./../components/footer/data/default.json'), true);

$loader = new \Twig_Loader_Filesystem(rtrim(__DIR__, '/') . '/../');
$twig = new \Twig_Environment($loader, array(
  'cache' => false,
));

$engine = new MarkdownEngine\MichelfMarkdownEngine();
$twig->addExtension(new MarkdownExtension($engine));

$profile = new Twig_Profiler_Profile();
$twig->addExtension(new Twig_Extension_Profiler($profile));

foreach (glob('./../pages/profiler/*.twig') as $templateFile) {
  $pathFragments = explode('/', $templateFile);
  $path = join('/', array_slice($pathFragments, 0, -1));
  $dataFile = $path . '/data.json';
  $pagename = join('', array_slice($pathFragments, -2, 1));
  $pageFile = './../../dist/' . $pagename . '.html';

  $data = json_decode(file_get_contents($dataFile), true);
  $data['globals'] = $globals;
  $data['config']['version'] = microtime(true);
  $data['header'] = $header;
  $data['footer'] = $footer;

  $html = $twig->render('pages/' . $pagename . '/template.twig', $data);
  file_put_contents($pageFile, $html);
}

$dumper = new Twig_Profiler_Dumper_Text();

$endtime = microtime(true);

echo '---' . "\r\n";
echo $dumper->dump($profile);
echo '---' . "\r\n";
echo 'Time taken: ' . ($endtime - $starttime) . ' secs.';

