import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:frontend/models/student.dart';
import 'package:frontend/utils/custom_theme.dart';
import 'package:frontend/widgets/card_skills_info.dart';

class StudentCard extends StatelessWidget {
  final Student student;
  const StudentCard({Key key, this.student}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    return Card(
      shadowColor: Color(0xffced5ff),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
        side: BorderSide(
          color: Color(0xffced5ff),
          width: 8.0,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          children: [
            _createStudentTitle(size, themeData.textTheme),
            _createStudentDescription(
                "This is a description about me...", themeData),
            _createStudentInfo(themeData),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: CardSkillsChips(
                  title: "Technical skills",
                  skills: student.skills["TECH"] ?? []),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: CardSkillsChips(
                  title: "Soft skills", skills: student.skills["SOFT"] ?? []),
            ),
          ],
        ),
      ),
    );
  }

  Widget _createStudentTitle(Size size, TextTheme textTheme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ConstrainedBox(
                constraints: BoxConstraints.loose(
                  Size(
                    size.width * .7,
                    size.height * .1,
                  ),
                ),
                child: AutoSizeText(
                  "${student.name} ${student.surname}",
                  style: textTheme.headline5.copyWith(
                    color: CustomTheme().textColor,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  "Find out more",
                  style: textTheme.subtitle1.copyWith(
                    color: CustomTheme().secondaryColor,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget _createStudentDescription(String description, ThemeData themeData) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Text(
        description,
        style:
            themeData.textTheme.subtitle1.copyWith(fontWeight: FontWeight.w400),
      ),
    );
  }

  Widget _createStudentInfo(ThemeData themeData) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 9.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          _createStudentInfoBox(
              "School of Life", "Jan 2020 - July 2022", themeData),
          _createStudentInfoBox(
              "School of Life", "Jan 2020 - July 2022", themeData),
        ],
      ),
    );
  }

  Widget _createStudentInfoBox(
      String title, String subTitle, ThemeData themeData) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        decoration: BoxDecoration(
          color: CustomTheme().backgroundColor,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(10.0, 4.0, 10.0, 0.0),
              child: Text(
                title,
                textAlign: TextAlign.start,
                style: themeData.textTheme.subtitle1.copyWith(
                  fontWeight: FontWeight.w800,
                  color: Color(0xff2c2c2c),
                  fontSize: 16.0,
                  fontStyle: FontStyle.normal
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(10.0, 1.0, 10.0, 8.0),
              child: Text(
                subTitle,
                style: themeData.textTheme.caption.copyWith(
                  fontStyle: FontStyle.italic,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
