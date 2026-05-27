import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contact from "@/lib/models/Contact";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    await dbConnect();

    const newContact = await Contact.create(validatedData);

    return NextResponse.json(
      { message: "Form Submitted Successfully", id: newContact._id },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Return the first error message for simplicity
      const firstError = error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
