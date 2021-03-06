import 'package:flutter/material.dart';
import 'package:frontend/screens/new_student/local_widget/education_experiences_form.dart';
import 'package:frontend/screens/new_student/local_widget/skills_form.dart';
import 'package:frontend/screens/new_student/local_widget/student_form.dart';
import 'package:frontend/models/student.dart';
import 'package:frontend/screens/new_student/local_widget/work_experiences_form.dart';
import 'package:provider/provider.dart';

class FormStepper extends ChangeNotifier {
  int step = 0;

  void goToPreviousFormStep() {
    step = step == 0 ? 0 : step -= 1;
    notifyListeners();
  }

  void goToNextFormStep() {
    step += 1;
    notifyListeners();
  }
}

class NewStudent extends StatefulWidget {
  @override
  _NewStudentState createState() => _NewStudentState();
}

class _NewStudentState extends State<NewStudent> {
  final _steps = [
    StudentForm(),
    EducationExperiencesForm(),
    WorkExperiencesForm(),
    SkillsForm(),
  ];

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(
          value: Student(),
        ),
        ChangeNotifierProvider.value(
          value: FormStepper(),
        ),
      ],
      builder: (context, _) {
        final stepper = context.watch<FormStepper>();
        return Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: Text(
              "Student Profile",
              textAlign: TextAlign.center,
            ),
            elevation: 0,
            leading: stepper.step == 0
                ? Container()
                : IconButton(
                    onPressed: () => stepper.goToPreviousFormStep(),
                    icon: Icon(Icons.arrow_back),
                  ),
          ),
          body: Container(
            width: MediaQuery.of(context).size.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              mainAxisSize: MainAxisSize.max,
              children: [
                _steps[stepper.step],
              ],
            ),
          ),
        );
      },
    );
  }
}
