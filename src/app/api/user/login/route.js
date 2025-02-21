const { connectDb } = require("@/utils/connectDb");
import User from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request) {
    connectDb();

  try {
    const req = await request.json();
    const { email, password } = req;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid password",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
