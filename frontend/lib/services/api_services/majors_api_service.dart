import 'dart:convert';
import 'package:frontend/services/custom_http_service.dart' as http;
import 'package:frontend/models/major.dart';
import 'package:frontend/services/api_service.dart';

class MajorsAPIService extends APIInfo {
  static Future<dynamic> route(String subRoute,
      {dynamic body, dynamic urlArgs}) {
    switch (subRoute) {
      case "/majors":
        return _getMajors(subRoute);
      default:
        throw MajorsAPIException();
    }
  }

  static Future<dynamic> _getMajors(String subRoute) async {
    var response = await http.get(APIInfo.apiEndpoint + subRoute);
    if (response.statusCode == 200) {
      final parsed = jsonDecode(response.body).cast<Map<String, dynamic>>();
      return parsed.map((majorJson) => Major.fromJson(majorJson)).toList();
    } else {
      print(response.body);
    }
  }
}

class MajorsAPIException extends APIException {}
