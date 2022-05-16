import 'dart:convert';
import 'dart:io';

// Print event to terminal
void log(String event) {
  print('@ [${DateTime.now().toUtc()}] -- $event');
}

// Read and parse json, then to list
Future<List<String>?> readJson(String path) async {
  if (!path.endsWith('.json')) {
    path = '$path.json';
  }

  final file = File(path);
  if (file.existsSync()) {
    log('Reading File');
    final content = await file.readAsString();
    log('File Read');

    log('Decoding Json');
    final json = jsonDecode(content);
    log('Json Decoded');

    return List.castFrom<dynamic, String>(json['words']);
  } else {
    log('File Not Found');
  }
}

// Create new file and export
Future<void> writeToJs(String path, List<String> words) async {
  if (!path.endsWith('.js')) {
    path = '$path.js';
  }

  final jsFile = File(path);

  log('Creating file');
  await jsFile.create();
  log('File Created');

  log('Writing File');
  await jsFile.writeAsString("export const words = ['${words.join("', '")}'];");
  log('File Written');
}

Future<void> main(List<String> args) async {
  final words = await readJson('words.json');
  if (words != null) {
    // Clean up (Filter word with length of 5)
    words.removeWhere((e) => e.length != 5);

    await writeToJs('words.js', words);
    log('Success');
  }
}
