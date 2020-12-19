import 'dart:async';
import 'dart:convert';

import 'package:frontend/services/auth_service.dart';
import 'package:frontend/utils/routes_generator.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

dynamic get(String route,
    {Map<String, String> headers, bool needsAuth = true}) async {
  try {
    if (needsAuth) {
      if (headers == null) {
        headers = Map();
      }
      headers["authorization"] = AuthService().jwtToken;
    }
    return await http.get(
      route,
      headers: headers,
    );
  } on AuthException catch (e) {
    Nav.navigatorKey.currentState.pushNamed("/login", arguments: true);
    return null;
  }
}

dynamic post(String route,
    {Map<String, String> headers,
    body,
    Encoding encoding,
    bool needsAuth = true}) async {
  try {
    if (needsAuth) headers["authorization"] = AuthService().jwtToken;
    return await http.post(
      route,
      headers: headers,
      body: body,
      encoding: encoding,
    );
  } on AuthException catch (e) {
    Nav.navigatorKey.currentState.pushNamed("/login", arguments: true);
    return null;
  }
}

dynamic put(String route,
    {Map<String, String> headers,
    body,
    Encoding encoding,
    bool needsAuth = true}) async {
  try {
    if (needsAuth) headers["authorization"] = AuthService().jwtToken;
    return await http.put(
      route,
      headers: headers,
      encoding: encoding,
    );
  } on AuthException catch (e) {
    Nav.navigatorKey.currentState.pushNamed("/login", arguments: true);
    return null;
  }
}

dynamic delete(String route,
    {Map<String, String> headers, bool needsAuth = true}) async {
  try {
    if (needsAuth) headers["authorization"] = AuthService().jwtToken;
    return await http.delete(
      route,
      headers: headers,
    );
  } on AuthException catch (e) {
    Nav.navigatorKey.currentState.pushNamed("/login", arguments: true);
    return null;
  }
}
