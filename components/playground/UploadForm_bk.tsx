import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/technicalIndex/CommonHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DialogContext } from "@/context/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FormSchema = z.object({
  symbol: z.string().min(1, { message: "Symbol is required" }),
  interval: z.string().default("D1"),
});

const UploadForm = () => {
  const { dialogContent } = useSelector((state: RootState) => state.dialog);
  const { setDialogVisible } = useContext(DialogContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symbol: "",
      interval: "D1",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);

    toast({
      title: "You submitted the following values:",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <span className="text-white">{JSON.stringify(data, null, 2)}</span>
        </div>
      ),
    });
  };

  return (
    <Card className="w-full">
      <CommonHeader title="Upload your personal chart data" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of the symbol, example: XAUUSD"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m1">m1</SelectItem>
                        <SelectItem value="m5">m5</SelectItem>
                        <SelectItem value="m15">m15</SelectItem>
                        <SelectItem value="m20">m20</SelectItem>
                        <SelectItem value="m30">m30</SelectItem>
                        <SelectItem value="H1">H1</SelectItem>
                        <SelectItem value="H2">H2</SelectItem>
                        <SelectItem value="H3">H3</SelectItem>
                        <SelectItem value="H4">H4</SelectItem>
                        <SelectItem value="H6">H6</SelectItem>
                        <SelectItem value="H8">H8</SelectItem>
                        <SelectItem value="H12">H12</SelectItem>
                        <SelectItem value="D1">D1</SelectItem>
                        <SelectItem value="W1">W1</SelectItem>
                        <SelectItem value="M1">M1</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDialogVisible(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UploadForm;
