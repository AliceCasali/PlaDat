import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:frontend/services/api_service.dart';

class MessagesAPIService extends APIInfo {
  static Future<dynamic> route(String subRoute,
      {dynamic body, dynamic urlArgs}) {
    switch (subRoute) {
      case "/messages":
        return _getMessages(subRoute);
      default:
        throw MessagesAPIException();
    }
  }

  static Future<dynamic> _getMessages(String subRoute) async {
    var response = await http.get(APIInfo.apiEndpoint + subRoute);
    if (response.statusCode == 200) {
      // final parsed = jsonDecode(response.body).cast<Map<String, dynamic>>();
      // return parsed.map((majorJson) => Major.fromJson(majorJson)).toList();
    }
  }
}

class MessagesAPIException extends APIException {}