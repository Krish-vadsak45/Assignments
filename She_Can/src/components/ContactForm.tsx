"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, ConfigProvider, App } from "antd";
import { UserOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const { TextArea } = Input;

// Define Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        messageApi.success("Message sent successfully!");
        setSubmitted(true);
        reset();
      } else {
        const errorMsg =
          typeof data.error === "string" ? data.error : "Submission failed";
        messageApi.error(errorMsg);
      }
    } catch (error) {
      console.error("Submission error:", error);
      messageApi.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="glass-panel soft-shadow border-none p-12 text-center rounded-[2.5rem]">
        <h2 className="font-display mb-3 text-3xl font-bold text-foreground">
          Thank You!
        </h2>
        <p className="mb-10 text-base text-muted max-w-[280px] mx-auto">
          We've received your message and our team will get back to you shortly.
        </p>
        <Button
          type="primary"
          size="large"
          className="h-14 w-full rounded-2xl bg-foreground font-bold hover:scale-[1.02] transition-transform border-none"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </Card>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#db2777",
          borderRadius: 12,
          fontFamily: "var(--font-manrope)",
        },
        components: {
          Input: {
            activeBorderColor: "#db2777",
            hoverBorderColor: "#db2777",
            paddingBlock: 12,
          },
          Button: {
            controlHeightLG: 56,
          },
        },
      }}
    >
      <Card className="glass-panel soft-shadow border-none overflow-hidden rounded-[2.5rem] p-4 md:p-10">
        <div className="mb-12">
          <h3 className="font-display mb-2 text-3xl font-bold tracking-tight text-foreground">
            Send a Message
          </h3>
          <p className="text-base text-muted">We'd love to hear from you.</p>
          <div className="mt-4 h-1 w-12 rounded-full bg-primary/20" />
        </div>

        <Form
          name="contact"
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                Full Name
              </span>
            }
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Jane Doe"
                  prefix={<UserOutlined className="text-muted/50 mr-2" />}
                  className="bg-white/50 border-slate-100 hover:bg-white focus:bg-white transition-all"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                Email Address
              </span>
            }
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="jane@example.com"
                  prefix={<MailOutlined className="text-muted/50 mr-2" />}
                  className="bg-white/50 border-slate-100 hover:bg-white focus:bg-white transition-all"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                Message
              </span>
            }
            validateStatus={errors.message ? "error" : ""}
            help={errors.message?.message}
          >
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  placeholder="How can we help you?"
                  rows={4}
                  className="bg-white/50 border-slate-100 hover:bg-white focus:bg-white transition-all"
                />
              )}
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all border-none"
            >
              <span>Transmit Message</span>
              <SendOutlined className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default ContactForm;
