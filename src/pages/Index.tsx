
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { ThesisSubmission } from "@/types/thesis";

type UserType = "lpu" | "non-lpu";

interface FormData {
  userType: UserType;
  name: string;
  studentNumber?: string;
  programDepartment?: string;
  schoolName?: string;
  thesisTitle: string;
}

const Index = () => {
  const [userType, setUserType] = useState<UserType>("lpu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const submission: Omit<ThesisSubmission, "id" | "created_at"> = {
        user_type: data.userType,
        name: data.name,
        student_number: data.studentNumber,
        program_department: data.programDepartment,
        school_name: data.schoolName,
        thesis_title: data.thesisTitle,
      };

      const { error } = await supabase
        .from("thesis_submissions")
        .insert([submission]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your thesis record has been submitted.",
      });
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit thesis record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Thesis Collection Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Label>User Type</Label>
                <RadioGroup
                  defaultValue="lpu"
                  onValueChange={(value: UserType) => setUserType(value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lpu" id="lpu" />
                    <Label htmlFor="lpu">LPU Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-lpu" id="non-lpu" />
                    <Label htmlFor="non-lpu">Non-LPU Student</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {userType === "lpu" ? (
                  <>
                    <div>
                      <Label htmlFor="studentNumber">Student Number</Label>
                      <Input
                        id="studentNumber"
                        {...register("studentNumber", {
                          required: "Student number is required for LPU students",
                        })}
                        className="mt-1"
                      />
                      {errors.studentNumber && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.studentNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="programDepartment">Program/Department</Label>
                      <Input
                        id="programDepartment"
                        {...register("programDepartment", {
                          required: "Program/Department is required for LPU students",
                        })}
                        className="mt-1"
                      />
                      {errors.programDepartment && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.programDepartment.message}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <Label htmlFor="schoolName">Name of School</Label>
                    <Input
                      id="schoolName"
                      {...register("schoolName", {
                        required: "School name is required for non-LPU students",
                      })}
                      className="mt-1"
                    />
                    {errors.schoolName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.schoolName.message}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="thesisTitle">Title of Thesis</Label>
                  <Input
                    id="thesisTitle"
                    {...register("thesisTitle", {
                      required: "Thesis title is required",
                    })}
                    className="mt-1"
                  />
                  {errors.thesisTitle && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.thesisTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
