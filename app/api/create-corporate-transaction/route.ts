import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role key to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, packageDuration, packagePrice, serviceTax, totalAmount } = body;

    if (!userId || !packageDuration || !packagePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use fixed UUIDs for corporate training packages
    // These should be created in the database or we'll create them on-the-fly
    const corporateCourseIds: Record<string, string> = {
      '15 Days': '11111111-1111-1111-1111-111111111111',
      '45 Days': '22222222-2222-2222-2222-222222222222',
      '3 Months': '33333333-3333-3333-3333-333333333333',
    };
    const corporateCourseId = corporateCourseIds[packageDuration] || corporateCourseIds['15 Days'];

    // Ensure we have a "Corporate Training" category and get its ID
    const CORPORATE_CATEGORY_NAME = 'Corporate Training';
    let corporateCategoryId: string | null = null;

    const { data: existingCategory, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('name', CORPORATE_CATEGORY_NAME)
      .single();

    if (categoryError && categoryError.code !== 'PGRST116') {
      console.error('Error fetching corporate training category:', categoryError);
    }

    if (existingCategory) {
      corporateCategoryId = existingCategory.id;
    } else {
      const { data: newCategory, error: insertCategoryError } = await supabaseAdmin
        .from('categories')
        .insert({ name: CORPORATE_CATEGORY_NAME })
        .select('id')
        .single();

      if (insertCategoryError) {
        console.error('Error creating corporate training category:', insertCategoryError);
      } else {
        corporateCategoryId = newCategory.id;
      }
    }

    // Check if this corporate training course exists, if not create it
    let { data: existingCourse } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', corporateCourseId)
      .single();

    if (!existingCourse) {
      // Create a placeholder course for corporate training
      const { error: courseError } = await supabaseAdmin
        .from('courses')
        .insert({
          id: corporateCourseId,
          title: `Corporate Training - ${packageDuration}`,
          description: `Corporate training package for ${packageDuration}. One-on-one training by specialized instructors. Available on-site in any city worldwide.`,
          instructor: 'Corporate Training Team',
          price: packagePrice,
          image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
          duration: packageDuration,
          level: 'Corporate',
          students: 0,
          rating: 5.0,
          // Use category_id to match current schema; if we couldn't
          // resolve/create a category, leave this null so insert still works.
          category_id: corporateCategoryId,
        });

      if (courseError && courseError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating corporate training course:', courseError);
        // If course creation fails, we'll still try to create the transaction
        // but we need a valid course_id, so we'll use a fallback
      }
    }

    // Create the transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        course_id: corporateCourseId,
        course_title: `Corporate Training - ${packageDuration}`,
        course_price: packagePrice,
        service_tax: serviceTax,
        total_amount: totalAmount,
        status: 'completed',
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating corporate training transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction', details: transactionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      transaction,
    });
  } catch (error: any) {
    console.error('Error in create-corporate-transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

