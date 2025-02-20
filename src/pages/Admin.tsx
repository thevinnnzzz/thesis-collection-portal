
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { ThesisSubmission } from "@/types/thesis";

const Admin = () => {
  const [submissions, setSubmissions] = useState<ThesisSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("thesis_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubmissions(data as ThesisSubmission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load thesis submissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from("thesis_submissions")
        .delete()
        .match({ id });

      if (error) throw error;

      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      toast({
        title: "Success",
        description: "Submission deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Thesis Submissions</h1>
          <Button onClick={fetchSubmissions}>Refresh</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student Number</TableHead>
                <TableHead>Program/School</TableHead>
                <TableHead>Thesis Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="capitalize">{submission.user_type}</TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.student_number || "-"}</TableCell>
                  <TableCell>
                    {submission.program_department || submission.school_name || "-"}
                  </TableCell>
                  <TableCell>{submission.thesis_title}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this submission?")) {
                          deleteSubmission(submission.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
