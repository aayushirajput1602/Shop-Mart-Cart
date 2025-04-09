
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ImageManager from '@/components/admin/ImageManager';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Album, ShieldAlert } from 'lucide-react';

const ImagesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
              <span>Image Management</span>
            </CardTitle>
            <CardDescription>
              Manage your product images in one central location
            </CardDescription>
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
      <div className="flex items-center gap-3 mb-8">
        <Album className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Image Management</h1>
      </div>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Upload and manage your product images here. You can add images by uploading files from your device
        or by entering URL links to external images. All uploaded images will be available for use in your product listings.
      </p>
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
