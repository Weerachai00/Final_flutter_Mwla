import 'dart:convert';
import 'package:fn_application/config/app.dart';
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PageService {
  static final Future<SharedPreferences> _prefs =
      SharedPreferences.getInstance();

  static Future<dynamic> fetchPages() async {
    final response = await get(
      Uri.parse('$API_URL/api/pages'),
      headers: {'Content-Type': 'application/json'},
    );

    print(response.body);
    return jsonDecode(response.body);
  }

  static Future<dynamic> fetchPage(String id) async {
    final response = await get(
      Uri.parse('$API_URL/api/pages/$id'),
      headers: {'Content-Type': 'application/json'},
    );

    print(response.body);
    return jsonDecode(response.body);
  }
}
