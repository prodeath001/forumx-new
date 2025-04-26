import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_URL } from "@/lib/api";

const CreateCommunity = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create a community",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, token, navigate, toast]);
  
  // Generate slug from name
  useEffect(() => {
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [name]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your community",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for your community",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const communityData = {
        name,
        description,
        category,
        isPrivate: privacy === "private"
      };
      
      const response = await axios.post(
        `${API_URL}/api/communities`,
        communityData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const communityResponse = response.data.data;
      
      toast({
        title: "Community created",
        description: `r/${name} has been created successfully!`,
      });
      
      // Redirect to the new community
      navigate(`/community/${communityResponse.slug || communityResponse._id}`);
    } catch (error: any) {
      toast({
        title: "Error creating community",
        description: error.response?.data?.message || error.response?.data?.error || "Failed to create community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-muted-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Create a Community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Photography"
                  disabled={isSubmitting}
                  maxLength={21}
                />
                <p className="text-xs text-muted-foreground">
                  Community names including capitalization cannot be changed.
                  <span className="float-right">{name.length}/21</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Community URL</Label>
                <div className="flex">
                  <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground">
                    r/
                  </div>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-l-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what your community is about..."
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  This is how new members come to understand your community.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="gaming">Gaming</option>
                  <option value="music">Music</option>
                  <option value="art">Art</option>
                  <option value="books">Books</option>
                  <option value="photography">Photography</option>
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="sports">Sports</option>
                  <option value="fitness">Fitness</option>
                  <option value="education">Education</option>
                  <option value="science">Science</option>
                  <option value="business">Business</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Community Type</Label>
                <RadioGroup value={privacy} onValueChange={setPrivacy}>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="public" id="public" className="mt-1" />
                    <div>
                      <Label htmlFor="public" className="font-medium">Public</Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can view, post, and comment to this community
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="restricted" id="restricted" className="mt-1" />
                    <div>
                      <Label htmlFor="restricted" className="font-medium">Restricted</Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can view this community, but only approved users can post
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="private" id="private" className="mt-1" />
                    <div>
                      <Label htmlFor="private" className="font-medium">Private</Label>
                      <p className="text-sm text-muted-foreground">
                        Only approved users can view and submit to this community
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Community"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateCommunity;
