import 'package:flutter/material.dart';
import 'package:frontend/main.dart';
import 'package:frontend/screens/new_placement/new_placement.dart';

class RoutesGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    final args = settings.arguments;

    switch (settings.name) {
      case '/home':
        {
          return MaterialPageRoute(builder: (_) => FirstPage());
        }
      case '/new-placement':
        {
          return MaterialPageRoute(builder: (_) => NewPlacement());
        }
      default:
        {
          return _errorRoute();
        }
    }
  }

  static Route<dynamic> _errorRoute() {
    return MaterialPageRoute(builder: (_) {
      return Scaffold(
        appBar: AppBar(
          title: Text("Error"),
        ),
        body: Center(
          child: Text("ERROR IN ROUTING"),
        ),
      );
    });
  }
}