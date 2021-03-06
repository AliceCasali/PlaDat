import 'dart:convert';
import 'package:frontend/models/placement.dart';
import 'package:frontend/models/student.dart';
import 'package:frontend/services/custom_http_service.dart' as http;
import 'package:frontend/services/api_service.dart';

class RecomendationsAPIService extends APIInfo {
  static Future<dynamic> route(String subRoute,
      {dynamic body, dynamic urlArgs}) {
    switch (subRoute) {
      case "/recommendation/id/seePlacements":
        return _getPlacementRecomendations(subRoute, urlArgs);
      case "/recommendation/id/seeStudents":
        return _getStudentRecomendations(subRoute, urlArgs);
      default:
        throw RecomendationsAPIException();
    }
  }

  static Future<dynamic> _getPlacementRecomendations(
      String subRoute, int id) async {
    var response = await http
        .get(APIInfo.apiEndpoint + "/recommendation/$id/seePlacements");
    if (response.statusCode == 200) {
      return jsonDecode(response.body)
          .map((placementJson) => Placement.fromJson(placementJson))
          .toList();
    } else {
      print(response.body);
    }
  }

  static Future<dynamic> _getStudentRecomendations(
      String subRoute, int id) async {
    var response =
        await http.get(APIInfo.apiEndpoint + "/recommendation/$id/seeStudents");
    if (response.statusCode == 200) {
      return jsonDecode(response.body)
          .map((studentJson) => Student.fromJson(studentJson))
          .toList();
    } else {
      print(response.body);
    }
  }
}

class RecomendationsAPIException extends APIException {}
