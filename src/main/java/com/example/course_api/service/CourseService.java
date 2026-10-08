package com.example.course_api.service;

import com.example.course_api.Course;
import java.util.List;

public interface CourseService {

    List<Course> getAllCourses();

    Course getCourseById(int id);

    Course addCourse(Course course);

    Course updateCourse(int id, Course course);

    boolean deleteCourse(int id);
}