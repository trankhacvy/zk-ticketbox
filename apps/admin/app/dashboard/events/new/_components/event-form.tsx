"use client";

import { createRpc, bn } from "@lightprotocol/stateless.js";
import { format, startOfDay } from "date-fns";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@acme/ui/components/button";
import * as sdk from "@repo/sdk";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/form";
import { Input } from "@acme/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/components/select";
import { Textarea } from "@acme/ui/components/textarea";
import { Calendar } from "@acme/ui/components/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";
import { cn } from "@acme/ui/lib/utils";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@acme/ui/components/radio-group";
import { toast } from "sonner";
import * as queries from "@ticketbox/db";
import useUser from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { LocationType } from "@ticketbox/db";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SOLANA_RPC_URL } from "@/constants/env";
import { nanoid } from "@/lib/utils";
import { uploadThumbnail } from "@/lib/actions";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];

const formSchema = z
  .object({
    thumbnail: z
      .any()
      .refine((files) => files?.length == 1, "Image is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),
    name: z.string().min(3, {
      message: "Event name must be at least 3 characters",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),
    startAt: z
      .date({
        required_error: "Start date is required",
      })
      .refine(
        (date) => {
          return date.getTime() > startOfDay(new Date()).getTime();
        },
        {
          message: "Start date must be in the future",
        }
      ),
    endAt: z.date({
      required_error: "End date is required",
    }),
    locationType: z.enum(["online", "offline"], {
      required_error: "Location type is required",
    }),
    platform: z.string().optional(),
    link: z.string().url({ message: "Please enter a valid URL" }).optional(),
    address: z.string().optional(),
    attendees: z.coerce.number().int().positive({
      message: "Number of attendees must be a positive number",
    }),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: "End date must be after start date",
    path: ["endAt"],
  })
  .refine(
    (data) => {
      if (data.locationType === "online") {
        return !!data.platform && !!data.link;
      }
      if (data.locationType === "offline") {
        return !!data.address;
      }
      return true;
    },
    {
      message: "Please fill in all required location fields",
      path: ["locationType"],
    }
  );

export default function EventForm({ pageTitle }: { pageTitle: string }) {
  const { user } = useUser();
  const router = useRouter();

  const { ready, wallets } = useSolanaWallets();

  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
      startAt: new Date(),
      endAt: new Date(new Date().setHours(new Date().getHours() + 1)),
      locationType: "offline" as LocationType,
      attendees: 10,
    }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const wallet = wallets.find(
        (wallet) => wallet.connectorType === "solana_adapter"
      );

      if (!ready || !wallet) {
        toast.error("Wallet not connected. Please connect your wallet.");
        return;
      }

      const thumbnail = values.thumbnail?.[0];

      if (!thumbnail) {
        toast.error("Thumbnail is required");
        return;
      }

      const uploadResult = await uploadThumbnail({
        name: values.name,
        description: values.description,
        thumbnail: thumbnail,
      });

      if (
        !uploadResult?.data?.success ||
        !uploadResult?.data?.data?.metadataUri
      ) {
        toast.error("Failed to upload thumbnail");
        return;
      }

      const eventId = nanoid(10);

      const payerPk = new PublicKey(wallet.address);

      const connection = createRpc(SOLANA_RPC_URL);

      const collectionKey = Keypair.generate().publicKey;

      const ix = await sdk.createTicketBoxIx(
        connection,
        payerPk,
        {
          eventId: eventId,
          eventName: values.name,
          metadataUri: uploadResult.data.data.metadataUri,
          startAt: bn(values.startAt.getTime() / 1000),
          endAt: bn(values.endAt.getTime() / 1000),
          maxSupply: bn(values.attendees),
        },
        collectionKey
      );

      const transaction = await sdk.buildTxWithComputeBudget(
        connection,
        [ix.instruction],
        new PublicKey(wallet.address)
      );

      const signature = await wallet.sendTransaction(transaction, connection);

      await queries.createEvent({
        id: eventId,
        name: values.name,
        description: values.description,
        startAt: values.startAt,
        endAt: values.endAt,
        locationType: values.locationType,
        locationName: values.locationType === "offline" ? values.address : "",
        locationAddress:
          values.locationType === "offline" ? values.address : "",
        locationUrl: values.locationType === "online" ? values.link : "",
        maxAttendees: values.attendees,
        currentAttendees: 0,
        isPublished: true,
        creatorId: user.id,
        thumbnailUrl: uploadResult.data.data.imageUrl,
        address: ix.ticketBoxAddress.toBase58(),
        transactionHash: signature,
      });

      toast.success("Event created successfully!");
      router.push(`/dashboard/events/${eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        "An error occurred while creating the event. Please try again."
      );
    }
  }

  return (
    <Card className="mx-auto max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            {/* Event Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and descriptive name for your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event in detail..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what attendees can expect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date/Time */}
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select start date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startOfDay(new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select when your event will begin (must be a future date)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date/Time */}
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select end date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => {
                        //   const startDate = form.getValues("startAt");
                        //   if (!startDate) return date < new Date();
                        //   // Allow same day selection but time validation happens in the schema
                        //   return (
                        //     date < new Date(startDate.setHours(0, 0, 0, 0))
                        //   );
                        // }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select when your event will end (must be after start time)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Type */}
            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="online" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Online Event
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="offline" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          In-Person Event
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select whether your event will be held online or in-person
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Online Platform (conditional) */}
            {form.watch("locationType") === "online" && (
              <>
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="zoom">Zoom</SelectItem>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="teams">Microsoft Teams</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the platform where your online event will be
                        hosted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide the URL where attendees can join your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Physical Address (conditional) */}
            {form.watch("locationType") === "offline" && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the full address..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide the complete address where the event will take
                      place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Number of Attendees */}
            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Number of Attendees</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormDescription>
                    Set the maximum capacity for your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
