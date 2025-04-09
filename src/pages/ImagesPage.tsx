
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ImageManager from '@/components/admin/ImageManager';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ImagesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Image Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <p className="text-muted-foreground text-center mb-6">
              You need to be logged in to access image management.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Image Management</h1>
      <div className="max-w-5xl mx-auto">
        <ImageManager />
        
        <div className="mt-8 flex justify-end">
          <Button variant="outline" asChild>
            <Link to="/profile">Back to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagesPage;
