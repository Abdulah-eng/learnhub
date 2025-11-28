import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, updates } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid updates data' },
        { status: 400 }
      );
    }

    // Prepare update object - map frontend fields to database fields
    const dbUpdates: any = {};

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.instructor !== undefined) dbUpdates.instructor = updates.instructor;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.level !== undefined) {
      // Validate level
      if (!['Beginner', 'Intermediate', 'Advanced'].includes(updates.level)) {
        return NextResponse.json(
          { error: 'Invalid level. Must be Beginner, Intermediate, or Advanced' },
          { status: 400 }
        );
      }
      dbUpdates.level = updates.level;
    }
    if (updates.students !== undefined) dbUpdates.students = updates.students;
    if (updates.rating !== undefined) {
      // Validate rating (0-5)
      const rating = parseFloat(updates.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 0 and 5' },
          { status: 400 }
        );
      }
      dbUpdates.rating = rating;
    }
    if (updates.image !== undefined) {
      // Map 'image' field to 'image_url' in database
      dbUpdates.image_url = updates.image || '';
    }

    // Update the course
    const { error } = await supabaseAdmin
      .from('courses')
      .update(dbUpdates)
      .eq('id', courseId);

    if (error) {
      console.error('Error updating course:', error);
      return NextResponse.json(
        { error: 'Failed to update course', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in update-course route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

