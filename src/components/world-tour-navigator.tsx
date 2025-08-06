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
  ChevronDown,
  Bus,
  Train,
  Ship,
  Languages,
  BadgePercent,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Siren,
  HelpCircle,
  Bike,
  Plane,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMounted } from '@/hooks/use-mobile';
import { generateSuggestions } from '@/app/actions';
import type { SmartStaySuggestionsOutput } from '@/ai/flows/smart-stay-suggestions';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const formSchema = z.object({
  currentLocation: z.string().min(2, { message: 'Current location is required.' }),
  destination: z.string().min(2, { message: 'Destination is required.' }),
  tripStartDate: z.date({ required_error: 'A start date is required.' }),
  travelers: z.coerce.number().int().min(1, { message: 'At least one traveler is required.' }),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  preferences: z.string().optional(),
  vehicle: z.string({ required_error: 'Please select a vehicle.' }),
  dailyTravelDistance: z.coerce.number().min(50, { message: 'Must travel at least 50 miles daily.' }),
});

type FormValues = z.infer<typeof formSchema>;

const vehicles = [
    { id: 'bike', name: 'Bike', icon: Bike, image: 'https://placehold.co/400x300.png', hint: 'motorcycle road trip' },
    { id: 'scooty', name: 'Scooty', icon: Bike, image: 'https://placehold.co/400x300.png', hint: 'scooter city' },
    { id: 'swift', name: 'Swift', icon: Car, image: 'https://placehold.co/400x300.png', hint: 'white hatchback car' },
    { id: 'etios', name: 'Etios', icon: Car, image: 'https://placehold.co/400x300.png', hint: 'white sedan car' },
    { id: 'eeco', name: 'Eeco', icon: Car, image: 'https://placehold.co/400x300.png', hint: 'white utility van' },
    { id: 'ertiga', name: 'Ertiga', icon: Car, image: 'https://placehold.co/400x300.png', hint: 'blue mpv car' },
    { id: 'innova', name: 'Innova', icon: Car, image: 'https://placehold.co/400x300.png', hint: 'black suv car' },
    { id: 'mini-bus', name: 'Mini Bus', icon: Bus, image: 'https://placehold.co/400x300.png', hint: 'white minibus' },
    { id: '18-seater', name: '18-Seater Bus', icon: Bus, image: 'https://placehold.co/400x300.png', hint: 'small tourist bus' },
    { id: '33-seater', name: '33-Seater Bus', icon: Bus, image: 'https://placehold.co/400x300.png', hint: 'large coach bus' },
    { id: 'flight', name: 'Flight', icon: Plane, image: 'https://placehold.co/400x300.png', hint: 'airplane window view' },
];

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <Card className='text-center'>
      <CardHeader className='items-center'>
          <div className='p-3 rounded-full bg-primary/10'>
            <Icon className="w-8 h-8 text-primary" />
          </div>
        <CardTitle className='pt-2'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )
}

function CurrencyConverter() {
  const [amount, setAmount] = React.useState(100);
  const [from, setFrom] = React.useState('USD');
  const [to, setTo] = React.useState('EUR');
  const [converted, setConverted] = React.useState(92.5); // Dummy data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingUp /> Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-end gap-2'>
          <div className='flex-1'>
            <Label htmlFor='amount'>Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
          </div>
          <div>
            <Label htmlFor='from'>From</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger id='from' className='w-[80px]'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='text-center text-muted-foreground'>TO</div>
        <div className='flex items-end gap-2'>
          <div className='flex-1'>
            <Label htmlFor='to-amount'>Converted Amount</Label>
            <Input id="to-amount" type="number" value={converted.toFixed(2)} readOnly className='font-bold text-lg' />
          </div>
          <div>
            <Label htmlFor='to'>To</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger id='to' className='w-[80px]'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className='text-xs text-muted-foreground'>Rates are for demonstration purposes only.</p>
      </CardFooter>
    </Card>
  )
}

function Translator() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages /> Translator</CardTitle>
                <CardDescription>Translate text between languages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Select defaultValue="en">
                    <SelectTrigger><SelectValue placeholder="From Language" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Enter text to translate..." />
                 <Select defaultValue="es">
                    <SelectTrigger><SelectValue placeholder="To Language" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Translation..." readOnly />
            </CardContent>
             <CardFooter>
                <Button>Translate</Button>
            </CardFooter>
        </Card>
    )
}

export default function WorldTourNavigator() {
  const { toast } = useToast();
  const isMounted = useIsMounted();
  const [activeView, setActiveView] = React.useState('plan');
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
      vehicle: undefined,
      dailyTravelDistance: 300,
    },
  });

  React.useEffect(() => {
    if (!isMounted) return;
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
  }, [isMounted, form, toast]);

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
    setActiveView('results');

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

  const menuItems = [
    { id: 'plan', label: 'Plan Trip', icon: Waypoints },
    { id: 'vehicle', label: 'Vehicle Selection', icon: Car },
    { id: 'results', label: 'Route & Stays', icon: Map, disabled: !formValues },
    { id: 'booking', label: 'Vehicle Booking', icon: ShieldCheck, disabled: true },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'tools', label: 'Tools', icon: Languages },
    { id: 'safety', label: 'Safety & More', icon: ShieldCheck },
  ]

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary-dark">
              WorldTour
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
                 <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                        isActive={activeView === item.id} 
                        onClick={() => setActiveView(item.id)}
                        disabled={item.disabled}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='flex-col gap-2'>
           <Button variant="outline" size="sm" onClick={handleLoadTrip}>
                <FolderOpen className="mr-2 h-4 w-4" /> Load Trip
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveTrip}>
                <Save className="mr-2 h-4 w-4" /> Save Trip
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-1">
          <div className='flex justify-between items-center mb-6'>
            <div className='lg:hidden'>
              <SidebarTrigger />
            </div>
            <h2 className='text-2xl font-bold font-headline'>
                {menuItems.find(item => item.id === activeView)?.label}
            </h2>
          </div>

          {activeView === 'plan' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div>
                     <Card className="shadow-lg">
                        <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                            <Waypoints /> Your Adventure Details
                        </CardTitle>
                        <CardDescription>Fill in the details below to get started. Choose your vehicle in the next step.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={(e) => { e.preventDefault(); setActiveView('vehicle'); }} className="space-y-6">
                            
                            <div className='space-y-4'>
                                <h3 className='font-semibold flex items-center gap-2'><MapPin /> Trip Details</h3>
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
                            </div>

                            <Separator />
                             <div className='space-y-4'>
                                <h3 className='font-semibold flex items-center gap-2'><Users /> Traveler Preferences</h3>
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
                                name="preferences"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Lodging Preferences (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., near beach, family-friendly, eco-stay" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                                                        
                            <Button type="submit" className="w-full !mt-8" size="lg">
                                Next: Choose Vehicle <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                            </form>
                        </Form>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card className="shadow-lg text-center h-full flex flex-col justify-center items-center p-8 bg-card">
                        <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="A stylized illustration of a map and a car" className="mb-6 rounded-lg" data-ai-hint="travel planning journey"/>
                        <h2 className="text-2xl font-bold font-headline text-primary-dark">Ready for an adventure?</h2>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            Your personalized trip itinerary will appear in the 'Route & Stays' section. Just fill out the form to discover optimized routes, smart stay suggestions, and more!
                        </p>
                    </Card>
                </div>
            </div>
          )}

          {activeView === 'vehicle' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Car /> Select Your Vehicle</CardTitle>
                        <CardDescription>Choose the best ride for your adventure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="vehicle"
                                    render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2"
                                        >
                                            {vehicles.map(vehicle => (
                                            <FormItem key={vehicle.id}>
                                                <FormControl>
                                                <RadioGroupItem value={vehicle.id} className="sr-only" />
                                                </FormControl>
                                                <FormLabel className={cn(
                                                "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer aspect-square transition-all duration-200",
                                                field.value === vehicle.id && "border-primary ring-2 ring-primary"
                                                )}>
                                                <Image src={vehicle.image} alt={vehicle.name} width={120} height={90} className='rounded-md object-cover flex-grow w-full' data-ai-hint={vehicle.hint}/>
                                                <span className="font-bold mt-2 text-center">{vehicle.name}</span>
                                                <vehicle.icon className="w-5 h-5 text-muted-foreground mt-1"/>
                                                </FormLabel>
                                            </FormItem>
                                            ))}
                                        </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="flex justify-between items-center !mt-8">
                                    <Button variant="outline" onClick={() => setActiveView('plan')}>Back</Button>
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                                        ) : (
                                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Smart Trip</>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
          )}

          {activeView === 'results' && (
            <div className="space-y-8">
                {error && (
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {(isSubmitting || tripResults || formValues) ? (
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
                ) : (
                <Card className="shadow-lg text-center h-full flex flex-col justify-center items-center p-8 bg-card">
                    <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="A stylized illustration of a map and a car" className="mb-6 rounded-lg" data-ai-hint="travel planning journey"/>
                    <h2 className="text-2xl font-bold font-headline text-primary-dark">No Trip Planned Yet</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Go to the "Plan Trip" section to start your journey. Your results will appear here once generated.
                    </p>
                </Card>
                )}
            </div>
          )}

          {activeView === 'budget' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BadgePercent/> Expense Estimator</CardTitle>
                        <CardDescription>An estimated breakdown of your trip costs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="font-medium">Estimated Fuel</span>
                            <span className="font-bold text-lg">$250.00</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="font-medium">Tolls</span>
                            <span className="font-bold text-lg">$34.50</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="font-medium">Lodging (3 nights)</span>
                            <span className="font-bold text-lg">$450.00</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                            <span className="font-medium">Food & Activities</span>
                            <span className="font-bold text-lg">$600.00</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between items-center p-3 rounded-lg border-2 border-primary">
                            <span className="font-bold text-lg">Total Estimated Cost</span>
                            <span className="font-bold text-2xl text-primary">$1334.50</span>
                        </div>
                    </CardContent>
                </Card>
                <CurrencyConverter />
             </div>
          )}
          {activeView === 'tools' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Translator />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle /> Visa Checker</CardTitle>
                        <CardDescription>Check visa requirements for your destination (placeholder).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>This feature is coming soon and will allow you to check visa requirements based on your nationality and destination.</p>
                    </CardContent>
                </Card>
             </div>
          )}
          {activeView === 'safety' && (
             <div className="space-y-8">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <FeatureCard icon={Siren} title="SOS / Emergency" description="Quick access to emergency contacts and local services." />
                    <FeatureCard icon={ShieldCheck} title="Safety Scores" description="AI-powered safety ratings for locations and neighborhoods." />
                    <FeatureCard icon={Leaf} title="Eco & Over-tourism" description="Find hidden gems and eco-friendly stays to travel responsibly." />
                </div>
                 <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>More Features Coming Soon!</AlertTitle>
                    <AlertDescription>
                        We're working on adding verified listings, dietary filters, detailed expense tracking, and more to make your trip planning even better.
                    </AlertDescription>
                </Alert>
            </div>
          )}
           {activeView === 'booking' && (
             <div className="text-center">
                 <Card className="shadow-lg text-center h-full flex flex-col justify-center items-center p-8 bg-card">
                    <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="A stylized illustration of a map and a car" className="mb-6 rounded-lg" data-ai-hint="online booking confirmation"/>
                    <h2 className="text-2xl font-bold font-headline text-primary-dark">Vehicle Booking Coming Soon</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        This section will allow you to book your chosen vehicle directly through our partners. Stay tuned!
                    </p>
                </Card>
             </div>
          )}
        </main>
      </SidebarInset>
    </div>
  );
}
