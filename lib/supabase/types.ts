export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor: string;
          price: number;
          image_url: string;
          duration: string;
          level: 'Beginner' | 'Intermediate' | 'Advanced';
          students: number;
          rating: number;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          instructor: string;
          price: number;
          image_url: string;
          duration: string;
          level: 'Beginner' | 'Intermediate' | 'Advanced';
          students?: number;
          rating?: number;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          instructor?: string;
          price?: number;
          image_url?: string;
          duration?: string;
          level?: 'Beginner' | 'Intermediate' | 'Advanced';
          students?: number;
          rating?: number;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

