'use client';

import { memo } from 'react';
import { Course } from '@/lib/types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface CourseCardProps {
  course: Course;
  onSelect: () => void;
  isPurchased: boolean;
}

export const CourseCard = memo(function CourseCard({ course, onSelect, isPurchased }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative" onClick={onSelect}>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isPurchased && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Owned</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4" onClick={onSelect}>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{course.level}</Badge>
          <Badge variant="outline">{course.category}</Badge>
        </div>
        
        <h3 className="mb-2 line-clamp-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {course.description}
        </p>
        
        <p className="text-sm text-gray-700 mb-3">
          By {course.instructor}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-gray-900 text-lg w-full sm:w-auto">${course.price.toFixed(2)}</span>
        <Button onClick={onSelect} variant={isPurchased ? "outline" : "default"} className="w-full sm:w-auto">
          {isPurchased ? 'View Course' : 'Learn More'}
        </Button>
      </CardFooter>
    </Card>
  );
});

