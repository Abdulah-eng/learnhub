'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Edit, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getAllCourses } from '@/lib/supabase/courses';

export function AdminCoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await getAllCourses();
      setCourses(allCourses);
    } catch (err: any) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      image: course.image,
      duration: course.duration,
      level: course.level,
      students: course.students,
      rating: course.rating,
    });
    setError(null);
  };

  const handleSave = async () => {
    if (!editingCourse) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/update-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: editingCourse.id,
          updates: editForm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update course');
      }

      // Update local state immediately instead of reloading all courses
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === editingCourse.id
            ? {
                ...course,
                ...editForm,
                // Ensure image is properly set
                image: editForm.image || course.image,
              }
            : course
        )
      );

      setEditingCourse(null);
      setEditForm({});
      
      // Show success message without blocking
      setTimeout(() => {
        alert('Course updated successfully!');
      }, 100);
    } catch (err: any) {
      console.error('Error updating course:', err);
      setError(err.message || 'Failed to update course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setEditForm({});
    setError(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Courses Management</h2>
          <p className="text-gray-600 text-sm">Edit course details and images</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {courses.length} Total Courses
        </Badge>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${course.id}/900/600`;
                }}
              />
              <Badge className="absolute top-2 right-2" variant="secondary">
                {course.level}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">By {course.instructor}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">${course.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
              </div>
              <Button
                onClick={() => handleEditClick(course)}
                className="w-full"
                size="sm"
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={handleCancel}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information and image URL
            </DialogDescription>
          </DialogHeader>

          {editingCourse && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Course title"
                  />
                </div>

                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={editForm.instructor || ''}
                    onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Course description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price || 0}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    placeholder="e.g., 45 hours"
                  />
                </div>

                <div>
                  <Label htmlFor="level">Level</Label>
                  <select
                    id="level"
                    value={editForm.level || 'Beginner'}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value as any })}
                    className="flex h-9 w-full rounded-md border border-gray-200/50 bg-white px-3 py-1 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="students">Students Count</Label>
                  <Input
                    id="students"
                    type="number"
                    min="0"
                    value={editForm.students || 0}
                    onChange={(e) => setEditForm({ ...editForm, students: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editForm.rating || 0}
                    onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image URL
                </Label>
                <Input
                  id="image"
                  type="text"
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  onFocus={(e) => e.target.select()}
                  placeholder="https://example.com/image.jpg"
                  className="font-mono text-sm"
                  autoComplete="off"
                  spellCheck="false"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL. If empty, a placeholder image will be used.
                </p>
                {editForm.image && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Preview:</p>
                    <img
                      src={editForm.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

