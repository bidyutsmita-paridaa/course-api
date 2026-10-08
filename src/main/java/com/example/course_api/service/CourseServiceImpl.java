package com.example.course_api.service;

import com.example.course_api.Course;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    private final List<Course> courses = new ArrayList<>();

    @Override
    public List<Course> getAllCourses() {
        return courses;
    }

    @Override
    public Course getCourseById(int id) {
        for (Course course : courses) {
            if (course.getId() == id) {
                return course;
            }
        }
        return null;
    }

    @Override
    public Course addCourse(Course course) {
        courses.add(course);
        return course;
    }

    @Override
    public Course updateCourse(int id, Course updatedCourse) {
        for (Course course : courses) {
            if (course.getId() == id) {
                course.setName(updatedCourse.getName());
                course.setDescription(updatedCourse.getDescription());
                return course;
            }
        }
        return null;
    }

    @Override
    public boolean deleteCourse(int id) {
        return courses.removeIf(course -> course.getId() == id);
    }
}