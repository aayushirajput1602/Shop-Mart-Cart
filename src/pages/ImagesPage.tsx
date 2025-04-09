
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
import { Album, ShieldAlert, ImageIcon, UploadCloud } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-6">
        <Album className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Image Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> 
              Image Library
            </CardTitle>
            <CardDescription>
              Manage all your product images in one place
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload high-quality images for your products to enhance your listings. All uploaded images will be available for use across the entire store.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Tips for best results:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use high-resolution images (1000×1000px minimum)</li>
                <li>• Keep file sizes below 5MB</li>
                <li>• Use consistent lighting and angles</li>
                <li>• Include white background product shots</li>
                <li>• Show products from multiple angles</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-primary" />
                Upload Images
              </CardTitle>
              <CardDescription>
                Add new product images to your library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageManager />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" asChild>
          <Link to="/profile">Back to Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default ImagesPage;
