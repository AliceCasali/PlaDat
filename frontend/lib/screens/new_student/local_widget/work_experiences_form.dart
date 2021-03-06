import 'package:flutter/material.dart';
import 'package:frontend/models/student.dart';
import 'package:frontend/models/work_experience.dart';
import 'package:frontend/screens/new_student/local_widget/experience_card.dart';
import 'package:frontend/screens/new_student/new_student.dart';
import 'package:frontend/utils/custom_theme.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class WorkExperiencesForm extends StatefulWidget {
  const WorkExperiencesForm({
    Key key,
  }) : super(key: key);

  @override
  WorkExperiencesFormState createState() => WorkExperiencesFormState();
}

class WorkExperiencesFormState extends State<WorkExperiencesForm> {
  final _formKey = GlobalKey<FormState>();
  bool _creatingExperience = false;

  List<dynamic> _experiences = [];

  WorkExperience _newExperience = WorkExperience();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    final student = Provider.of<Student>(context);
    final formStepper = Provider.of<FormStepper>(context);
    final List<WorkExperience> works = [...student.works ?? [], ..._experiences]
        .toSet()
        .toList()
        .cast<WorkExperience>();
    return SizedBox(
      width: size.width * .9,
      height: size.height * .85,
      child: Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Flexible(
            child: _createAddExperienceRow(),
            flex: 1,
          ),
          _creatingExperience
              ? Flexible(
                  child: _createExperienceForm(student),
                  flex: 3,
                )
              : Container(),
          Flexible(
            flex: _creatingExperience ? 1 : 4,
            child: works.isNotEmpty
                ? ListView.builder(
                    itemCount: works.length,
                    itemBuilder: (_, index) {
                      return ExperienceCard(
                        experience: works[index],
                      );
                    },
                  )
                : Container(),
          ),
          Flexible(
            flex: 1,
            child: RaisedButton(
              onPressed: () {
                if (!_creatingExperience ||
                    (_creatingExperience && _formKey.currentState.validate())) {
                  student.works = works.cast<WorkExperience>();
                  setState(() {
                    formStepper.goToNextFormStep();
                  });
                }
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10.0),
                child: Text(
                  "Continue",
                  style: themeData.textTheme.subtitle1.copyWith(
                    color: Colors.white,
                    fontSize: 18.0,
                    fontStyle: FontStyle.normal,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  _toggleExperienceCreationForm() {
    setState(() {
      _creatingExperience = !_creatingExperience;
    });
  }

  _createAddExperienceRow() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisSize: MainAxisSize.max,
        children: [
          Text(
            "Work Experience",
            style: Theme.of(context).textTheme.subtitle1.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 18.0,
                color: CustomTheme().primaryColor),
          ),
          Spacer(),
          IconButton(
            icon: _creatingExperience ? Icon(Icons.close) : Icon(Icons.add),
            onPressed: _toggleExperienceCreationForm,
          )
        ],
      ),
    );
  }

  _createExperienceForm(Student student) {
    return Form(
      key: _formKey,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
          color: Colors.white,
          boxShadow: [CustomTheme().boxShadow],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: _createWorkForm(student),
          ),
        ),
      ),
    );
  }

  _createWorkForm(Student student) {
    final formatter = DateFormat('dd/MMM/yyyy');
    return [
      TextFormField(
        decoration: const InputDecoration(
            hintText: 'Position',
            hintStyle: TextStyle(fontSize: 16, color: Color(0xff4c4c4c))),
        initialValue: _newExperience.position ?? "",
        onChanged: (value) {
          setState(() {
            _newExperience.position = value;
          });
        },
        validator: (value) {
          if (value.isEmpty) {
            return 'Please enter the position of your experience';
          }
          return null;
        },
      ),
      TextFormField(
        decoration: const InputDecoration(
            hintText: 'Company Name',
            hintStyle: TextStyle(fontSize: 16, color: Color(0xff4c4c4c))),
        initialValue: _newExperience.companyName ?? "",
        onChanged: (value) {
          setState(() {
            _newExperience.companyName = value;
          });
        },
        validator: (value) {
          if (value.isEmpty) {
            return 'Please enter the company of your experience';
          }
          return null;
        },
      ),
      TextFormField(
        onTap: () => _openDatePicker(),
        decoration: InputDecoration(
            hintText: _newExperience.startPeriod != null &&
                    _newExperience.endPeriod != null
                ? "${formatter.format(_newExperience.startPeriod)} - ${formatter.format(_newExperience.endPeriod)} "
                : "Period of work (mm/yyyy - mm-yyyy)",
            hintStyle: TextStyle(fontSize: 16, color: CustomTheme().textColor)),
        readOnly: true,
        validator: (_) {
          if (_newExperience.startPeriod.isAfter(DateTime.now()))
            return "Starting date can't be in the future";
          return null;
        },
      ),
      Padding(
        padding: const EdgeInsets.all(10.0),
        child: Row(
          children: [
            Text(
              'Describe your work experience',
              style: TextStyle(
                fontSize: 16,
                color: CustomTheme().textColor,
              ),
              textAlign: TextAlign.left,
            ),
          ],
        ),
      ),
      TextFormField(
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
        ),
        initialValue: _newExperience.description ?? "",
        onChanged: (value) {
          setState(() {
            _newExperience.description = value;
          });
        },
        maxLines: 4,
        validator: (value) {
          if (value.isEmpty) {
            return 'Please enter some text';
          }
          return null;
        },
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.end,
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          FlatButton(
            child: Text("Save",
                style: Theme.of(context).textTheme.subtitle1.copyWith(
                      color: CustomTheme().accentTextColor,
                    )),
            onPressed: () {
              if (_formKey.currentState.validate()) {
                setState(() {
                  _experiences.add(_newExperience);
                  student.works = [
                    ...student.works ?? [],
                    ..._experiences,
                  ];
                  _newExperience = new WorkExperience();
                  _creatingExperience = false;
                });
              }
            },
          ),
        ],
      ),
    ];
  }

  void _openDatePicker() async {
    final DateTimeRange range = await showDateRangePicker(
      context: context,
      initialDateRange: DateTimeRange(
        start: _newExperience.startPeriod ?? DateTime.now(),
        end: _newExperience.endPeriod ??
            (new DateTime.now()).add(new Duration(days: 7)),
      ),
      firstDate: DateTime.now().subtract(Duration(days: 365 * 100)),
      lastDate: (DateTime.now()).add(Duration(days: 365 * 100)),
      builder: (context, child) {
        return Theme(
            data: Theme.of(context).copyWith(
              primaryColor: CustomTheme().primaryColor.withOpacity(.7),
            ),
            child: child);
      },
    );
    if (range != null) {
      setState(() {
        // picked is always ordered with the smaller one coming at index 0
        _newExperience.startPeriod = range.start;
        _newExperience.endPeriod = range.end;
      });
    }
  }
}
