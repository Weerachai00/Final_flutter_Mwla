import 'dart:async';
import 'dart:convert';
import 'package:fn_application/service/auth_service.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  Future<void> checkLogin() async {
    final prefs = await _prefs;
    final token = prefs.getString('token');
    if (token != null) {
      Navigator.of(context).pushReplacementNamed('/home');
    }
  }

  @override
  void initState() {
    super.initState();
    AuthService.checkLogin().then((value) {
      if (value) {
        Navigator.pushNamed(context, '/home');
      }
    });
  }

  Future login() async {
    final response = await http.post(
      Uri.parse('$API_URL/api/auth/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': _email.text,
        'password': _password.text,
      }),
    );

    print(response.statusCode);
    if (response.statusCode == 200) {
      final prefs = await _prefs;
      prefs.setString('token', jsonDecode(response.body)['token']);
      Navigator.of(context).pushReplacementNamed('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text('กรุณาเข้าสู่ระบบ'),
            TextFormField(
              controller: _email,
              decoration: const InputDecoration(
                labelText: 'อีเมล',
              ),
            ),
            TextFormField(
              controller: _password,
              decoration: const InputDecoration(
                labelText: 'รหัสผ่าน',
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: login,
              child: const Text('เข้าสู่ระบบ'),
            )
          ],
        ),
      ),
    );
  }
}
