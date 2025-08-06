'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Globe,
  Save,
  FolderOpen,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Wallet,
  Sparkles,
  Car,
  ChevronRight,
  Loader2,
  Map,
  CloudSun,
  TrafficCone,
  DollarSign,
  BedDouble,
  Clock,
  Waypoints,
  Info,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateSuggestions } from '@/app/actions';
import type { SmartStaySuggestionsOutput } from '@/ai/flows/smart-stay-suggestions';

const formSchema = z.object({
  currentLocation: z.string().min(2, { message: 'Current location is required.' }),
  destination: z.string().min(2, { message: 'Destination is required.' }),
  tripStartDate: z.date({ required_error: 'A start date is required.' }),
  travelers: z.coerce.number().int().min(1, { message: 'At least one traveler is required.' }),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  preferences: z.string().optional(),
  vehicle: z.enum(['omni', 'tempo', 'bus']),
  dailyTravelDistance: z.coerce.number().min(50, { message: 'Must travel at least 50 miles daily.' }),
});

type FormValues = z.infer<typeof formSchema>;

const vehicles = [
  { id: 'omni', name: 'Omni', capacity: '2-4', image: 'https://placehold.co/400x300.png', hint: 'white van' },
  { id: 'tempo', name: 'Tempo Traveller', capacity: '5-12', image: 'https://placehold.co/400x300.png', hint: 'white minibus' },
  { id: 'bus', name: 'Bus', capacity: '13+', image: 'https://placehold.co/400x300.png', hint: 'tourist bus' },
];

export default function WorldTourNavigator() {
  const { toast } = useToast();
  const [tripResults, setTripResults] = React.useState<SmartStaySuggestionsOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: '',
      destination: '',
      travelers: 1,
      budget: 'moderate',
      preferences: '',
      vehicle: 'tempo',
      dailyTravelDistance: 300,
    },
  });

  React.useEffect(() => {
    try {
      const savedTrip = localStorage.getItem('worldtour_trip');
      if (savedTrip) {
        const parsedTrip = JSON.parse(savedTrip);
        form.reset({
          ...parsedTrip.formValues,
          tripStartDate: new Date(parsedTrip.formValues.tripStartDate),
        });
        setTripResults(parsedTrip.tripResults);
        setFormValues({
          ...parsedTrip.formValues,
          tripStartDate: new Date(parsedTrip.formValues.tripStartDate),
        });
        toast({
          title: 'Trip Loaded',
          description: 'Your previously saved trip has been loaded.',
        });
      }
    } catch (e) {
      console.error('Failed to load trip from localStorage', e);
    }
  }, [form, toast]);
  

  const handleSaveTrip = () => {
    if (!formValues) {
        toast({
            variant: "destructive",
            title: "Nothing to save",
            description: "Please plan a trip first before saving.",
        });
        return;
    }
    try {
        const tripData = { formValues, tripResults };
        localStorage.setItem('worldtour_trip', JSON.stringify(tripData));
        toast({
            title: "Trip Saved!",
            description: "Your trip has been saved to your browser's local storage.",
        });
    } catch (e) {
        console.error('Failed to save trip to localStorage', e);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save your trip.",
        });
    }
  };

  const handleLoadTrip = () => {
    try {
        const savedTrip = localStorage.getItem('worldtour_trip');
        if (savedTrip) {
            const parsedTrip = JSON.parse(savedTrip);
            form.reset({
                ...parsedTrip.formValues,
                tripStartDate: new Date(parsedTrip.formValues.tripStartDate),
            });
            setTripResults(parsedTrip.tripResults);
            setFormValues({
              ...parsedTrip.formValues,
              tripStartDate: new Date(parsedTrip.formValues.tripStartDate),
            });
            toast({
                title: "Trip Loaded",
                description: "Your trip has been loaded from local storage.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "No Saved Trip",
                description: "We couldn't find a saved trip in your browser.",
            });
        }
    } catch (e) {
        console.error('Failed to load trip from localStorage', e);
    }
  };

  const handleCalendarSync = () => {
    toast({
      title: 'Sync to Calendar',
      description: 'This feature allows syncing your trip dates and stays to your Google Calendar.',
    });
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);
    setTripResults(null);
    setFormValues(values);

    const input = {
      ...values,
      tripStartDate: format(values.tripStartDate, 'yyyy-MM-dd'),
    };

    const result = await generateSuggestions(input);

    if (result.success && result.data) {
      setTripResults(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary-dark">
                WorldTour Navigator
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLoadTrip}>
                <FolderOpen className="mr-2 h-4 w-4" /> Load Trip
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveTrip}>
                <Save className="mr-2 h-4 w-4" /> Save Trip
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <Waypoints /> Plan Your Adventure
              </CardTitle>
              <CardDescription>Fill in the details below to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className='text-lg font-semibold'>
                        <div className='flex items-center gap-2'><MapPin /> Trip Details</div>
                      </AccordionTrigger>
                      <AccordionContent className='pt-4 space-y-4'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="currentLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., New York, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Los Angeles, CA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="tripStartDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
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
                                        format(field.value, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
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
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-2">
                      <AccordionTrigger className='text-lg font-semibold'>
                        <div className='flex items-center gap-2'><Users /> Traveler Preferences</div>
                      </AccordionTrigger>
                      <AccordionContent className='pt-4 space-y-4'>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="travelers"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Travelers</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your budget" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="budget">Budget</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="luxury">Luxury</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="preferences"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lodging Preferences (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., near beach, family-friendly" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                      <AccordionTrigger className='text-lg font-semibold'>
                        <div className='flex items-center gap-2'><Car /> Vehicle & Pace</div>
                      </AccordionTrigger>
                      <AccordionContent className='pt-4 space-y-4'>
                          <FormField
                            control={form.control}
                            name="dailyTravelDistance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Daily Miles</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 300" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="vehicle"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Vehicle Choice</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                                  >
                                    {vehicles.map(vehicle => (
                                      <FormItem key={vehicle.id}>
                                        <FormControl>
                                          <RadioGroupItem value={vehicle.id} className="sr-only" />
                                        </FormControl>
                                        <FormLabel className={cn(
                                          "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer aspect-square",
                                          field.value === vehicle.id && "border-primary"
                                        )}>
                                          <Image src={vehicle.image} alt={vehicle.name} width={100} height={75} className='rounded-md object-cover flex-grow' data-ai-hint={vehicle.hint}/>
                                          <span className="font-bold mt-2">{vehicle.name}</span>
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Users className="w-3 h-3"/> {vehicle.capacity}
                                          </span>
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button type="submit" className="w-full !mt-8" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Generate Smart Trip</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-8">
            {error && (
                 <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {(isSubmitting || tripResults || formValues) && (
              <>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Map/> Google Maps Overview</CardTitle>
                        <CardDescription>A look at your route with traffic, toll, and weather info.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitting ? <Skeleton className="w-full h-[250px] rounded-lg" /> : 
                        <div className='space-y-4'>
                            <Image src="https://placehold.co/1200x600.png" alt="Map of the route" width={1200} height={600} className="rounded-lg border" data-ai-hint="map route" />
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                                <div className='bg-secondary p-3 rounded-lg'>
                                    <p className='text-sm font-medium text-muted-foreground'>Traffic</p>
                                    <p className='font-bold flex items-center justify-center gap-2'><TrafficCone className='w-4 h-4 text-primary'/> Light</p>
                                </div>
                                <div className='bg-secondary p-3 rounded-lg'>
                                    <p className='text-sm font-medium text-muted-foreground'>Est. Tolls</p>
                                    <p className='font-bold flex items-center justify-center gap-2'><DollarSign className='w-4 h-4 text-primary'/> $34.50</p>
                                </div>
                                <div className='bg-secondary p-3 rounded-lg'>
                                    <p className='text-sm font-medium text-muted-foreground'>Weather</p>
                                    <p className='font-bold flex items-center justify-center gap-2'><CloudSun className='w-4 h-4 text-primary'/> Sunny</p>
                                </div>
                                <div className='bg-secondary p-3 rounded-lg'>
                                    <p className='text-sm font-medium text-muted-foreground'>Route</p>
                                    <p className='font-bold flex items-center justify-center gap-2'><Car className='w-4 h-4 text-primary'/> Fastest</p>
                                </div>
                            </div>
                        </div>
                        }
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BedDouble /> Smart Stay Suggestions</CardTitle>
                         <CardDescription>AI-powered recommendations for your overnight stays.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSubmitting ? (
                             <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : tripResults && tripResults.suggestedStops.length > 0 ? (
                            <div className="space-y-4">
                                {tripResults.suggestedStops.map((stop, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-background">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg font-headline flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> {stop.location}</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Clock className="w-4 h-4"/> Est. Arrival: {format(new Date(stop.estimatedArrivalTime), 'EEE, MMM d, yyyy @ h:mm a')}</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="hidden sm:flex" onClick={handleCalendarSync}><CalendarIcon className="mr-2 h-4 w-4"/> Add to Calendar</Button>
                                        </div>
                                        <Separator className="my-3" />
                                        <p className="text-sm">{stop.reason}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No stay suggestions available for this route.</p>
                        )}
                    </CardContent>
                </Card>
              </>
            )}

            {!isSubmitting && !tripResults && !formValues && (
                <Card className="shadow-lg text-center lg:col-span-3 h-full flex flex-col justify-center items-center p-8 bg-card">
                    <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="A stylized illustration of a map and a car" className="mb-6 rounded-lg" data-ai-hint="travel planning journey"/>
                    <h2 className="text-2xl font-bold font-headline text-primary-dark">Ready for an adventure?</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Your personalized trip itinerary will appear here. Just fill out the form on the left to discover optimized routes, smart stay suggestions, and more!
                    </p>
                </Card>
            )}
        </div>
      </main>
    </div>
  );
}
