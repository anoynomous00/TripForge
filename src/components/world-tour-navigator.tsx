
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
  Calculator,
  CalendarDays,
  Camera,
  Upload,
  Phone,
  User,
  Building,
  Mail,
  Hotel,
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
import { generateSuggestions, translateText, convertCurrency } from '@/app/actions';
import type { SmartStaySuggestionsOutput } from '@/ai/flows/smart-stay-suggestions';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  currentLocation: z.string().min(2, { message: 'Current location is required.' }),
  destination: z.string().min(2, { message: 'Destination is required.' }),
  tripStartDate: z.date({ required_error: 'A start date is required.' }),
  travelers: z.coerce.number().int().min(1, { message: 'At least one traveler is required.' }),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  preferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomBikeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19.48,8.21l-2.84-2.84C16.14,4.88,15.53,4.5,14.86,4.5H11.5c-1.3,0-2.5,0.78-3.08,2L4.6,12.55 c-0.27,0.56-0.42,1.17-0.42,1.8V17c0,1.1,0.9,2,2,2h1c0.55,0,1-0.45,1-1v-1c0-0.55-0.45-1-1-1H7v-1.5 c0-0.07,0.01-0.14,0.02-0.21l1.9-4.24C9.1,11.39,9.55,11,10.15,11h3.35c0.3,0,0.59,0.1,0.82,0.28l4.47,3.58 c0.3,0.24,0.71,0.29,1.07,0.13c0.41-0.19,0.69-0.59,0.69-1.04V9C20,8.7,19.8,8.42,19.48,8.21z" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );

const vehicles = [
  { id: 'bike', name: 'Bike', icon: CustomBikeIcon, pricing: { nonAc: { highway: 7, ghat: 7 }, driver: 300 } },
  { id: 'scooty', name: 'Scooty', icon: Bike, pricing: { nonAc: { highway: 7, ghat: 7 }, driver: 300 } },
  { id: 'swift', name: 'Swift', icon: Car, pricing: { nonAc: { highway: 10, ghat: 11 }, ac: { highway: 12, ghat: 13 }, driver: 500 } },
  { id: 'etios', name: 'Etios', icon: Car, pricing: { nonAc: { highway: 10, ghat: 10.5 }, ac: { highway: 12, ghat: 12.5 }, driver: 500 } },
  { id: 'eeco', name: 'Eeco', icon: Car, pricing: { nonAc: { highway: 10, ghat: 10.5 }, ac: { highway: 12, ghat: 12.5 }, driver: 500 } },
  { id: 'ertiga', name: 'Ertiga', icon: Car, pricing: { nonAc: { highway: 15, ghat: 16 }, ac: { highway: 17, ghat: 18 }, driver: 500 } },
  { id: 'innova', name: 'Innova', icon: Car, pricing: { nonAc: { highway: 15, ghat: 16 }, ac: { highway: 17, ghat: 18 }, driver: 500 } },
  { id: 'mini-bus', name: 'Mini Bus', icon: Bus, pricing: { nonAc: { highway: 22, ghat: 24 }, ac: { highway: 25, ghat: 27 }, driver: 800 } },
  { id: '18-seater', name: '18-Seater Bus', icon: Bus, pricing: { nonAc: { highway: 22, ghat: 24 }, ac: { highway: 25, ghat: 27 }, driver: 800 } },
  { id: '33-seater', name: '33-Seater Bus', icon: Bus, pricing: { nonAc: { highway: 32, ghat: 35 }, ac: { highway: 36, ghat: 39 }, driver: 800 } },
  { id: 'flight', name: 'Flight', icon: Plane, pricing: null },
];

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};


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

function CurrencyConverter({ toCurrency, onToCurrencyChange }: { toCurrency: string; onToCurrencyChange: (value: string) => void }) {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState(100);
  const [from, setFrom] = React.useState('USD');
  const [converted, setConverted] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConversion = React.useCallback(async () => {
    if (amount <= 0 || from === toCurrency) {
      setConverted(amount);
      return;
    }
    setIsLoading(true);
    setConverted(null);
    const result = await convertCurrency({ amount, from, to: toCurrency });
    if (result.success && result.data) {
      setConverted(result.data.convertedAmount);
    } else {
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: result.error,
      });
      setConverted(null);
    }
    setIsLoading(false);
  }, [amount, from, toCurrency, toast]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleConversion();
    }, 500); // Debounce API calls

    return () => clearTimeout(debounceTimer);
  }, [handleConversion]);


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
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='text-center text-muted-foreground'>TO</div>
        <div className='flex items-end gap-2'>
          <div className='flex-1 relative'>
            <Label htmlFor='to-amount'>Converted Amount</Label>
            <Input id="to-amount" type="number" value={converted?.toFixed(2) || ''} readOnly className='font-bold text-lg' placeholder='Converting...'/>
            {isLoading && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin" />}
          </div>
          <div>
            <Label htmlFor='to'>To</Label>
            <Select value={toCurrency} onValueChange={onToCurrencyChange}>
              <SelectTrigger id='to' className='w-[80px]'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className='text-xs text-muted-foreground'>Live exchange rates are used for conversion.</p>
      </CardFooter>
    </Card>
  )
}

function Translator() {
    const { toast } = useToast();
    const [sourceLanguage, setSourceLanguage] = React.useState('English');
    const [targetLanguage, setTargetLanguage] = React.useState('Kannada');
    const [inputText, setInputText] = React.useState('');
    const [translatedText, setTranslatedText] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast({ variant: 'destructive', title: 'Input required', description: 'Please enter text to translate.' });
            return;
        }
        setIsLoading(true);
        setTranslatedText('');

        const result = await translateText({
            text: inputText,
            sourceLanguage,
            targetLanguage,
        });

        if (result.success && result.data) {
            setTranslatedText(result.data.translatedText);
        } else {
            toast({ variant: 'destructive', title: 'Translation Failed', description: result.error });
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages /> Translator</CardTitle>
                <CardDescription>Translate text between languages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger><SelectValue placeholder="From Language" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Kannada">Kannada</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Enter text to translate..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                 <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger><SelectValue placeholder="To Language" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Kannada">Kannada</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea placeholder="Translation..." value={translatedText} readOnly />
            </CardContent>
             <CardFooter>
                <Button onClick={handleTranslate} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</> : 'Translate'}
                </Button>
            </CardFooter>
        </Card>
    )
}

function FareCalculator({ vehicleId, currencySymbol }: { vehicleId: string | undefined, currencySymbol: string }) {
  const [kms, setKms] = React.useState(100);
  const [days, setDays] = React.useState(1);
  const [roadType, setRoadType] = React.useState<'highway' | 'ghat'>('highway');
  const [isAc, setIsAc] = React.useState(false);
  const [totalFare, setTotalFare] = React.useState(0);

  const selectedVehicle = React.useMemo(() => {
    return vehicles.find(v => v.id === vehicleId);
  }, [vehicleId]);

  React.useEffect(() => {
    if (!selectedVehicle || !selectedVehicle.pricing) {
      setTotalFare(0);
      return;
    }
    const { pricing } = selectedVehicle;
    const pricingTier = isAc && pricing.ac ? pricing.ac : pricing.nonAc;
    const rate = pricingTier[roadType];
    const fare = (kms * rate) + (days * pricing.driver);
    setTotalFare(fare);
  }, [kms, days, roadType, isAc, selectedVehicle]);
  
  if (!selectedVehicle || !selectedVehicle.pricing) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Fare Calculator</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-muted-foreground h-48">
                <p>Please select a vehicle to calculate the fare.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator /> Fare Calculator</CardTitle>
            <CardDescription>Estimate your travel cost for the <span className='font-bold text-primary'>{selectedVehicle.name}</span>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className='grid grid-cols-2 gap-4'>
                <div className="space-y-2">
                    <Label className='flex items-center gap-2'><Waypoints/> Road Type</Label>
                    <Select onValueChange={(value: 'highway' | 'ghat') => setRoadType(value)} defaultValue={roadType}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="highway">Highway</SelectItem>
                            <SelectItem value="ghat">Ghat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label className='flex items-center gap-2'><Waypoints /> Kilometers</Label>
                    <Input type="number" value={kms} onChange={(e) => setKms(Number(e.target.value))}/>
                </div>
                 <div className="space-y-2">
                    <Label className='flex items-center gap-2'><CalendarDays /> Days</Label>
                    <Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
                </div>
                {selectedVehicle.pricing.ac && (
                 <div className="flex items-center space-x-2 pt-6">
                    <Switch id="ac-switch" checked={isAc} onCheckedChange={setIsAc}/>
                    <Label htmlFor="ac-switch">With A/C</Label>
                  </div>
                )}
            </div>
            <Separator />
            <div className="flex justify-between items-center p-3 rounded-lg border-2 border-primary bg-primary/5">
                <span className="font-bold text-lg">Estimated Total Fare</span>
                <span className="font-bold text-2xl text-primary">{currencySymbol}{totalFare.toLocaleString()}</span>
            </div>
            <p className='text-xs text-muted-foreground'>This is an estimate. It includes driver charges but excludes tolls, taxes, and other fees.</p>
        </CardContent>
    </Card>
  )
}

function StudentOfferCard() {
  const [idCard, setIdCard] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdCard(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BadgePercent /> Student Offer</CardTitle>
        <CardDescription>Get 30% off your next trip by uploading your student ID card.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        {preview ? (
          <div className="relative group">
            <Image
              src={preview}
              alt="ID card preview"
              width={400}
              height={250}
              className="rounded-lg object-cover w-full aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" onClick={handleUploadClick}>Change Photo</Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center h-48 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleUploadClick}
          >
            <Camera className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="font-semibold">Take a Snapshot</p>
            <p className="text-sm text-muted-foreground">or Upload ID Card</p>
          </div>
        )}
         <div className="space-y-2">
            <Label htmlFor="college-name">College Name</Label>
            <Input id="college-name" placeholder="Enter your college name" />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!idCard}>Claim 30% Off</Button>
      </CardFooter>
    </Card>
  );
}


function HandicapOfferCard() {
  const [certificate, setCertificate] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificate(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BadgePercent /> Offer for Specially Abled</CardTitle>
        <CardDescription>Get 50% off by uploading your disability certificate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        {preview ? (
          <div className="relative group">
            <Image
              src={preview}
              alt="Certificate preview"
              width={400}
              height={250}
              className="rounded-lg object-cover w-full aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" onClick={handleUploadClick}>Change Photo</Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center h-48 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleUploadClick}
          >
            <Camera className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="font-semibold">Take a Snapshot</p>
            <p className="text-sm text-muted-foreground">or Upload Certificate</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button disabled={!certificate}>Claim 50% Off</Button>
      </CardFooter>
    </Card>
  );
}

function FamilyOfferCard() {
    const [names, setNames] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [place, setPlace] = React.useState('');
  
    const canClaim = names.trim() !== '' && contact.trim() !== '' && place.trim() !== '';
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Family/Group Offer</CardTitle>
          <CardDescription>Get 10% off for groups of 5 or more members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family-names">Names of All Members</Label>
            <Textarea
              id="family-names"
              placeholder="e.g., John Doe, Jane Doe,..."
              value={names}
              onChange={(e) => setNames(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-no">Contact Number</Label>
              <Input
                id="contact-no"
                placeholder="Enter a contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="family-place">Your City/Place</Label>
              <Input
                id="family-place"
                placeholder="Enter your city"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={!canClaim}>Claim 10% Off</Button>
        </CardFooter>
      </Card>
    );
  }

const lodgingPrices = {
  ac: {
    '2': 2500,
    '3': 3500,
    '4': 4500,
  },
  nonAc: {
    '2': 1500,
    '3': 2500,
    '4': 3500,
  },
};

type RoomType = 'ac' | 'nonAc';
type SharingType = '2' | '3' | '4';

function LodgeBookingCard({ currencySymbol }: { currencySymbol: string }) {
  const [roomType, setRoomType] = React.useState<RoomType>('nonAc');
  const [sharing, setSharing] = React.useState<SharingType>('2');
  const [nights, setNights] = React.useState(1);
  const [rooms, setRooms] = React.useState(1);

  const pricePerNight = lodgingPrices[roomType][sharing];
  const totalCost = pricePerNight * nights * rooms;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BedDouble /> Lodge Booking</CardTitle>
        <CardDescription>Configure your stay and estimate the cost.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Room Type</Label>
            <RadioGroup value={roomType} onValueChange={(val: RoomType) => setRoomType(val)} className="flex gap-4 pt-1">
              <Label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="nonAc" /> Non-AC
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="ac" /> AC
              </Label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Sharing Capacity</Label>
            <RadioGroup value={sharing} onValueChange={(val: SharingType) => setSharing(val)} className="grid grid-cols-3 gap-4 pt-1">
              {['2', '3', '4'].map(num => (
                <Label
                  key={num}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all',
                    sharing === num && 'border-primary ring-2 ring-primary'
                  )}
                >
                  <Users className="w-8 h-8 mb-1" />
                  <span className="font-bold">{num} Sharing</span>
                  <span className="text-xs text-muted-foreground">{currencySymbol}{lodgingPrices[roomType][num as SharingType]}/night</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nights">Number of Nights</Label>
            <Input id="nights" type="number" value={nights} onChange={e => setNights(Math.max(1, Number(e.target.value)))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Number of Rooms</Label>
            <Input id="rooms" type="number" value={rooms} onChange={e => setRooms(Math.max(1, Number(e.target.value)))} />
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg border-2 border-primary bg-primary/5">
          <span className="font-bold text-lg">Total Lodging Cost</span>
          <span className="font-bold text-2xl text-primary">{currencySymbol}{totalCost.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book Lodge (Placeholder)</Button>
      </CardFooter>
    </Card>
  );
}


export default function WorldTourNavigator() {
  const { toast } = useToast();
  const isMounted = useIsMounted();
  const [activeView, setActiveView] = React.useState('trip-details');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toCurrency, setToCurrency] = React.useState('INR');
  const [tripSuggestions, setTripSuggestions] = React.useState<SmartStaySuggestionsOutput | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: '',
      destination: '',
      travelers: 1,
      budget: 'moderate',
      preferences: '',
    },
  });
  
  const handleTripDetailsSubmit = async () => {
    setIsSubmitting(true);
    setTripSuggestions(null);
    const values = form.getValues();
    const input = {
      ...values,
      tripStartDate: format(values.tripStartDate, 'yyyy-MM-dd'),
    };
    const result = await generateSuggestions(input);
    if (result.success && result.data) {
      setTripSuggestions(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not get route',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const input = {
      ...values,
      tripStartDate: format(values.tripStartDate, 'yyyy-MM-dd'),
    };

    const result = await generateSuggestions(input); 
    
    if (result.success && result.data) {
        setTripSuggestions(result.data);
        toast({
          title: "Suggestions Generated!",
          description: "Check out the AI-powered route suggestions.",
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: result.error || 'Could not process your trip details. Please try again.',
        });
    }
    
    setIsSubmitting(false);
  }

  const menuItems = [
    { id: 'trip-details', label: 'Trip Details', icon: Waypoints },
    { id: 'vehicle-selection', label: 'Vehicle Selection', icon: Car },
    { id: 'lodge-booking', label: 'Lodge Booking', icon: BedDouble },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'offers', label: 'Offers', icon: BadgePercent },
    { id: 'tools', label: 'Translator (Assistant)', icon: Languages },
    { id: 'safety', label: 'Safety & More', icon: ShieldCheck },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ]

  if (!isMounted) {
    return null;
  }

  const currencySymbol = currencySymbols[toCurrency] || '₹';

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Image src="https://www.gstatic.com/images/branding/product/1x/maps_64dp.png" alt="TRIPFORGE Logo" width={40} height={40} />
            <h1
              className="text-2xl font-bold"
              style={{
                backgroundImage: 'linear-gradient(to right, #facc15, #ef4444, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TRIPFORGE
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
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='flex-col gap-2'>
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

          {activeView === 'trip-details' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
                <div className='space-y-8'>
                     <Card className="shadow-lg">
                        <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                           <Waypoints/> Your Adventure Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details below to get route suggestions.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className='space-y-4'>
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
                                            <Input placeholder="e.g., near beach, family-friendly, eco-stay" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            
                            <div className='flex justify-end items-center !mt-8'>
                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Suggestions...</> : (
                                    <>
                                     <Sparkles className="mr-2 h-4 w-4" /> Get Route Suggestions
                                    </>
                                    )}
                                </Button>
                            </div>
                            </form>
                        </Form>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card className="shadow-lg">
                           <CardHeader>
                               <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Map/> Suggested Routes</CardTitle>
                               <CardDescription>Our AI has crafted these routes just for you. Select one to see details.</CardDescription>
                           </CardHeader>
                            <CardContent>
                                {isSubmitting ? (
                                    <div className="space-y-4">
                                        <div className='flex items-center gap-4'>
                                            <Skeleton className='h-12 w-12 rounded-full'/>
                                            <div className='space-y-2'>
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                         <div className='flex items-center gap-4'>
                                            <Skeleton className='h-12 w-12 rounded-full'/>
                                            <div className='space-y-2'>
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    </div>
                                ) : !tripSuggestions ? (
                                    <div className='text-center text-muted-foreground py-10'>
                                        <p>Fill out the form and click "Get Route Suggestions" to see your personalized travel plans here.</p>
                                    </div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {tripSuggestions?.suggestedRoutes.map((route, rIndex) => (
                                            <AccordionItem key={rIndex} value={`item-${rIndex}`}>
                                                <AccordionTrigger className='text-lg font-semibold hover:no-underline'>
                                                    {route.routeName}
                                                </AccordionTrigger>
                                                <AccordionContent className='space-y-6 pt-4'>
                                                     <div>
                                                        <h4 className='font-semibold mb-2'>Path:</h4>
                                                        <div className="flex flex-wrap gap-x-2 gap-y-2 items-center text-sm">
                                                        {route.routeCities.map((city, cIndex) => (
                                                            <React.Fragment key={city}>
                                                                <div className="font-medium bg-muted px-2 py-1 rounded">{city}</div>
                                                                {cIndex < route.routeCities.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                                            </React.Fragment>
                                                        ))}
                                                        </div>
                                                     </div>
                                                     <div>
                                                         <h4 className='font-semibold mb-2'>Suggested Overnight Stops:</h4>
                                                         <div className='space-y-4'>
                                                            {route.suggestedStops.map((stop, sIndex) => (
                                                                <div key={sIndex} className='p-3 border rounded-lg bg-background'>
                                                                    <p className='font-bold flex items-center gap-2'><Hotel className='text-primary'/> {stop.location}</p>
                                                                    <p className='text-sm text-muted-foreground pl-7'><span className='font-medium'>Arrival:</span> {format(new Date(stop.estimatedArrivalTime), 'PPp')}</p>
                                                                    <p className='text-sm mt-2 pl-7'>{stop.reason}</p>
                                                                </div>
                                                            ))}
                                                         </div>
                                                     </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                </div>
            </div>
          )}

          {activeView === 'vehicle-selection' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                <div className='lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><Car/> Select Vehicle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={selectedVehicleId} onValueChange={setSelectedVehicleId} className='space-y-2'>
                                {vehicles.map(v => (
                                    <Label key={v.id} className={cn('flex items-center gap-3 p-3 rounded-lg border-2 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5 cursor-pointer')}>
                                        <RadioGroupItem value={v.id} />
                                        <v.icon className='w-6 h-6 text-muted-foreground'/>
                                        <span>{v.name}</span>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                    <FareCalculator vehicleId={selectedVehicleId} currencySymbol={currencySymbol} />
                </div>
             </div>
          )}

          {activeView === 'lodge-booking' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <LodgeBookingCard currencySymbol={currencySymbol} />
                <Card>
                    <CardHeader>
                        <CardTitle>Why Book With Us?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className='flex items-start gap-4'>
                            <ShieldCheck className='w-8 h-8 text-primary mt-1'/>
                            <div>
                                <h3 className='font-semibold'>Verified Stays</h3>
                                <p className='text-muted-foreground'>Every property is hand-picked and verified by our team for quality and safety.</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <TrendingUp className='w-8 h-8 text-primary mt-1'/>
                            <div>
                                <h3 className='font-semibold'>Best Price Guarantee</h3>
                                <p className='text-muted-foreground'>We ensure you get the best possible rates for your chosen accommodation.</p>
                            </div>
                        </div>
                         <div className='flex items-start gap-4'>
                            <HelpCircle className='w-8 h-8 text-primary mt-1'/>
                            <div>
                                <h3 className='font-semibold'>24/7 Support</h3>
                                <p className='text-muted-foreground'>Our support team is always available to assist you with any booking-related queries.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          )}

          {activeView === 'budget' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                <CurrencyConverter toCurrency={toCurrency} onToCurrencyChange={setToCurrency} />
             </div>
          )}

          {activeView === 'offers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <StudentOfferCard />
                <HandicapOfferCard />
                <FamilyOfferCard />
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

          {activeView === 'help' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle/> Contact Us</CardTitle>
                        <CardDescription>If you want any clarity you can contact our agency TRIPFORGE.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center gap-4">
                            <Building className="w-5 h-5 text-muted-foreground" />
                            <span><span className="font-semibold">Agency:</span> TRIPFORGE</span>
                        </div>
                        <Separator/>
                        <div className="flex items-center gap-4">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <span><span className="font-semibold">Contact Person:</span> Gagan</span>
                        </div>
                        <Separator/>
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <a href="tel:9025487520" className="text-primary hover:underline">9025487520</a>
                        </div>
                         <Separator/>
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <a href="tel:9042002420" className="text-primary hover:underline">9042002420</a>
                        </div>
                        <Separator/>
                         <div className="flex items-center gap-4">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <a href="mailto:gaganbn@gmail.com" className="text-primary hover:underline">gaganbn@gmail.com</a>
                        </div>
                        <Separator/>
                        <div className="flex items-center gap-4">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                            <span><span className="font-semibold">Location:</span> Davanagere</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                   <Image src="https://placehold.co/400x300.png" data-ai-hint="customer support travel" width={400} height={300} alt="Customer support" className="rounded-t-lg" />
                   <CardHeader className="text-center">
                      <CardTitle>We're Here for You!</CardTitle>
                   </CardHeader>
                   <CardContent className="text-center text-muted-foreground">
                      Our team is dedicated to making your travel experience smooth and memorable.
                   </CardContent>
                </Card>
            </div>
          )}
        </main>
      </SidebarInset>
    </div>
  );
}
