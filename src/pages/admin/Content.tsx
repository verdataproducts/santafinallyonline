import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentFormData {
  key: string;
  title: string;
  content: string;
  image_url: string;
  is_active: boolean;
}

const initialFormData: ContentFormData = {
  key: '',
  title: '',
  content: '',
  image_url: '',
  is_active: true,
};

export default function AdminContent() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState<ContentFormData>(initialFormData);
  const { toast } = useToast();

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleCreateContent = async () => {
    if (!formData.key || !formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Key and title are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .insert({
          key: formData.key,
          title: formData.title,
          content: formData.content || null,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content created successfully',
      });
      setIsCreateOpen(false);
      setFormData(initialFormData);
      fetchContents();
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast({
        title: 'Error',
        description: error.message?.includes('unique') 
          ? 'A content item with this key already exists' 
          : 'Failed to create content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async () => {
    if (!selectedContent || !formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          title: formData.title,
          content: formData.content || null,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
        })
        .eq('id', selectedContent.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
      setIsEditOpen(false);
      setSelectedContent(null);
      setFormData(initialFormData);
      fetchContents();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedContent) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', selectedContent.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content deleted successfully',
      });
      setIsDeleteOpen(false);
      setSelectedContent(null);
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (content: SiteContent) => {
    setSelectedContent(content);
    setFormData({
      key: content.key,
      title: content.title || '',
      content: content.content || '',
      image_url: content.image_url || '',
      is_active: content.is_active,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (content: SiteContent) => {
    setSelectedContent(content);
    setIsDeleteOpen(true);
  };

  const toggleActive = async (content: SiteContent) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ is_active: !content.is_active })
        .eq('id', content.id);

      if (error) throw error;
      fetchContents();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Site Content</h1>
            <p className="text-muted-foreground">Manage banners, announcements, and more</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
                <DialogDescription>Create a new site content item</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Key * (unique identifier)</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="e.g., hero_banner, announcement"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Content title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Content text or HTML"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContent} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Content'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Content</CardTitle>
            <CardDescription>{contents.length} content items</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : contents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No content found. Add your first content item!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-mono text-sm">
                          {content.key}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {content.title}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={content.is_active}
                            onCheckedChange={() => toggleActive(content)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(content)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(content)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
              <DialogDescription>Update content details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key</Label>
                <Input value={formData.key} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image_url">Image URL</Label>
                <Input
                  id="edit-image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateContent} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Content</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedContent?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteContent} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Content'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}