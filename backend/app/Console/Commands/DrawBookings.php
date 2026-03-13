<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Listing;
use App\Booking;
use App\Cleaning;
use App\Price;
use App\Channels\ChannelAbstract;
use App\Objects\UpdateBookings;

class DrawBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booking:draw {listing*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'update bookings';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {// NOTE: Level 1 Point Of Entry. No logic should take place here. Only variables extracted and passed to object. This is so that object and same logic can be called from places other than here (with consistent results).
        // Step 1: Oursource into Object
//DrawBookingsObject.Draw(date1, date2, listings_set, configurables = [0,0,1,0,1,1,1,1,1,0,0,1])
        // Step 2: Communicate Result: Console Printing, File Saving, Emailing / Notifications
        //// Save to File ()
        // TODO
        //// Email
//my_mailer->mail([users => data])
        // TODO
        // $data = [
        //     'name'    => 'Devin Norby',
        //     'message' => 'This is a test email'
        // ];
        // \Mail::send( new TestMail( $data ) );
        //// Print
        // TODO


        $date1 = false;//$this->option('date1');
        $date2 = false;//$this->option('date2');
        $arguments = $this->arguments();
        // collect($this->arguments())->map(function($listing_id){
        //     return Listing::find($listing_id);
        // });

        $date1= $date1 ? $date1 : \Carbon\Carbon::now()->subDay()->toDateString();
        $date2= $date2 ? $date2 : \Carbon\Carbon::createFromFormat('Y-m-d', $date1)->addDays(30)->toDateString();

///////////////////////////////////////////////////////////////////
////////////////////Replacement Code Start/////////////////////////
///////////////////////////////////////////////////////////////////

        $listings_list = $arguments['listing'];
        if(count($listings_list) == 0 || (count($listings_list) > 0 && $listings_list[0] == 0)) {
            $listings_parameter = null;
        } else {
            $listings_parameter = $listings_list;
        }

        $this->info('UPDATING LISTINGS: ' . json_encode($listings_parameter));

        $current_time = \Carbon\Carbon::now();
        $pull_log_file = "log/system_booking_pulls/" . $current_time->toDateTimeString() . ".log";
        \Storage::disk('local')->put($pull_log_file, 'PULLING BOOKING DATA AT ' . $current_time->toDateTimeString() . PHP_EOL);

        $booking_updator = new UpdateBookings($listings_parameter,$date1,$date2,$pull_log_file);

        $booking_updator->start();

        $booking_results = $booking_updator->get_booking_results();
echo "BOOKINGS RESULTS: " . json_encode($booking_results,JSON_UNESCAPED_UNICODE);
        $cleaning_results = $booking_updator->get_cleaning_results();

        echo PHP_EOL;
        if(count($booking_results) > 0){
            $booking_results_keys = array_keys($booking_results[0]);
            $filtered_bookings = collect($booking_results)->filter(function($value, $key){
                return $value['updated'] || $value['created'];
            });
            $this->table($booking_results_keys, $filtered_bookings);    

        } else { echo "No Bookings Resulted."; }
        echo PHP_EOL;
        if(count($cleaning_results) > 0){
            $this->table(array_keys($cleaning_results[0]), $cleaning_results);
        } else { echo "No Cleanings Resulted."; }
///////////////////////////////////////////////////////////////////
////////////////////Replacement Code End///////////////////////////
///////////////////////////////////////////////////////////////////









//         $this->line('Pulling Booking data with the following parameters:');
//         $this->line('date1: [' . $date1 . ']');
//         $this->line('date2: [' . $date2 . ']');
//         $this->line('listings:');

//         foreach ($arguments['listing'] as $argument) {
//             $this->line('--[' . $argument . ']');
//         }

//         ////////////////////
//         // get the set of listings to udpate, or find all of them.
//         // Note that flatten is called after mapping, because Listing::find(X) can return null if none found , which would cause errors later.
//         $listings_list = $arguments['listing'][0] == 0 ? Listing::all() : collect($arguments['listing'])->map(function($listing){
//             return Listing::find($listing);
//         })->filter(function ($thing) {
//             return !empty($thing);
//         });
//         // die("LISTINGS : " . $listings_list);
//         $this->line('listings pulled:');
//         $bar = $this->output->createProgressBar(count($listings_list));
//         $client = new \GuzzleHttp\Client();
//         $bookings_table = [];
//         // ['confirmation_code','guest_name','checkin','checkout','number_of_guests','number_of_beds','message_thread_id','price','existing','updated','inserted'];
//         $cleanings_table = [];
//         $double_booking_errors = 0;
//         foreach ($listings_list as $listing) {
// // Draw booking Data from listing and process
//             $channelObject = ChannelAbstract::getChannelObject($listing->channel_account->channel_id);
//             $listing_channel_id=$listing->channel_listing_id;
//             try {
//                 $authenticaitonParameters = decrypt($listing->channel_account->authentication_token);
//             } catch (DecryptException $e) {
//                 $this->error('Failed to decrypt authentication parameters for listing [' . $listing->id . ']'. PHP_EOL);
//                 return; 
//             }
//             $processed = $channelObject->process($listing_channel_id,$date1,$date2,$authenticaitonParameters,$client);
//             // skip if error
//             if(!$processed){
//                 $this->error('Location [' . $listing->id . ']\'s ChannelObject received the following error calling getDateDefinitions: [' . json_encode($channelObject->getError()) . '] ... Skipping'. PHP_EOL);
//                 continue; 
//             }
// // Draw done. 
// // For each booking, check if exists
//             $this->info('Location [' . $listing->id . ']\'s drew [' . count($channelObject->bookings_data) . '] bookings.'. PHP_EOL);

//             foreach ($channelObject->getBookings() as $booking) {
//                 $updated = false;
//                 $bookingExists = false;
//                 $inserted = false;

//                 $booking['listing_id'] = $listing->id;

//                 $system_bookings = Booking::where([
//                     'listing_id'=>$booking['listing_id'],
//                     'confirmation_code'=>$booking['confirmation_code']
//                 ]);
//                 if($system_bookings->count() > 1){
//                     $this->error('[DUPLICATE BOOKING ERROR] Listing [' . $listing->id . ']\'s Booking confirmation code: [' . $booking['confirmation_code'] . '] Contains a duplicate booking within the system. Skipping.'. PHP_EOL);
//                     continue;
//                 } elseif($system_bookings->count() > 0){
//                     $system_booking = $system_bookings->get()[0];
//                     // Booking Exists
//                     $bookingExists = true;
//                     $system_booking->checkin = $booking['checkin'];
//                     $last_checkout = $system_booking->checkout;
//                     $system_booking->checkout = $booking['checkout'];
//                     $system_booking->guests = $booking['number_of_guests'];
//                     $system_booking->beds = $booking['number_of_beds'];
//                     $booking_price = $system_booking->price;
//                     if(!is_null($booking_price)){
//                         $booking_price->total=$booking['price'];
//                         $booking_price->save();
//                     }
//                     $lastUpdated = $system_booking->updated_at->toDateTimeString();
//                     $system_booking->save();
//                     $system_booking = Booking::find($system_booking->id);
//                     if($lastUpdated != $system_booking->updated_at->toDateTimeString()){
//                         // Email staff that booking updated.
//                         $updated = true;
//                         // if Checkout updated: update cleanings, log.
//                         if($last_checkout != $system_booking->checkout){
//                             $listing->locations->map(function($location) use ($last_checkout,$system_booking,&$cleanings_table){
//                                 $cleanings = Cleaning::where([
//                                     'location_id'=>$location->id,
//                                     'cleaning_date'=>$last_checkout,
//                                 ]);
//                                 if($cleanings->count() > 1){
//                                     $this->error('[DUPLICATE BOOKING ERROR] Listing [' . $listing->id . ']\'s Booking confirmation code: [' . $booking['confirmation_code'] . '] Contains a duplicate booking within the system. Skipping.'. PHP_EOL);
//                                 return;
//                                 } elseif ($cleanings->count() > 0) {
//                                     $cleaning = $cleanings->get()[0];
//                                     $cleaning->cleaning_date = $system_booking->checkout;
//                                     $cleaning->save();
//                                     $cleanings_table[] = ['location_id'=>$location->id,'location_code'=>$location->building_name . ' ' . $location->room_number,'cleaning_date'=>$last_checkout,'action'=>'updated'];
//                                 } else{
//                                     //DNE, create
//                                     $cleaning = Cleaning::create(['location_id'=>$location->id,'cleaning_date'=>$last_checkout]);
//                                     $cleanings_table[] = ['location_id'=>$location->id,'location_code'=>$location->building_name . ' ' . $location->room_number,'cleaning_date'=>$booking['checkout'],'action'=>'createdViaUpdate'];
//                                 }
                                
//                             });
//                         }
//                     }
//                 } else {
//                     // Booking DNE, make new
//                     if(\App\Booking::overlaps($listing,$booking['checkin'],$booking['checkout'])){
//                         $double_booking_errors++;
//                         $this->error('[DOUBLE BOOKING ERROR] Listing [' . $listing->id . ']\'s Booking: [' . json_encode($booking) . '] overlaps with another booking!! Skipping...'. PHP_EOL);
//                         continue;
//                     } else {
//                         $booking['guests'] = $booking['number_of_guests'];
//                         $booking['beds'] = $booking['number_of_beds'];
//                         if(isset($booking['price'])){
//                             $booking['price_id'] = Price::create(['total'=>$booking['price'],'description'=>'Booking ('.$booking['confirmation_code'].')'])->id;
//                         }
//                         Booking::create($booking); 
//                         $inserted = true; 
//                         // Create Cleanings 
//                         $listing->locations->map(function($location) use ($booking,&$cleanings_table){
//                             $cleaning = Cleaning::create([
//                                 'location_id'=>$location->id,
//                                 'cleaning_date'=>$booking['checkout']
//                             ]);
//                             $cleanings_table[] = ['location_id'=>$location->id,'location_code'=>$location->building_name . ' ' . $location->room_number,'cleaning_date'=>$booking['checkout'],'action'=>'created'];

//                         }); 
//                     }
//                 }


//                 $confirmation_code = $booking['confirmation_code'];
//                 $guest_name = $booking['guest_name'];
//                 $checkin = $booking['checkin'];
//                 $checkout = $booking['checkout'];
//                 $number_of_guests = $booking['number_of_guests'];
//                 $number_of_beds = $booking['number_of_beds'];
//                 $message_thread_id = $booking['message_thread_id'];
//                 $price = $booking['price'];

//                 $bookings_table[] = [
//                     'listing_id'=>$listing->id,
//                     'listing_title'=>$listing->listing_title,
//                     'confirmation_code'=>$confirmation_code,
//                     'guest_name'=>$guest_name,
//                     'checkin'=>$checkin,
//                     'checkout'=>$checkout,
//                     'number_of_guests'=>$number_of_guests,
//                     'number_of_beds'=>$number_of_beds,
//                     'message_thread_id'=>$message_thread_id,
//                     'price'=>$price,
//                     'bookingExists'=>$bookingExists,
//                     'updated'=>$updated,
//                     'inserted'=>$inserted,];
//             }






//             $bar->advance();
//             $this->line("\r");
//         }
//         $bar->finish();
//         $this->line(PHP_EOL);
//         $headers = ['listing_id','listing_title','confirmation_code','guest_name','checkin','checkout','number_of_guests','number_of_beds','message_thread_id','price','bookingExists','updated','inserted',];
//         $this->table($headers, $bookings_table);
//         $headersc = ['location_id','location_code','cleaning_date','action',];        
//         $this->table($headersc, $cleanings_table);
        
    }
    // public function print_array($array,$depth=0){
    //     if(!is_array($array)){echo "** First Element must be array **";return;}
    //     for ($i=0; $i < $depth; $i++) { echo "\t"; }
    //     foreach ($array as $key => $value) {
    //         if(is_array($value)){
    //             echo $key . ": {" . PHP_EOL;
    //             print_array($value,$depth+1);
    //         } else {
    //             echo $key . ": " . $value . PHP_EOL;
    //         }
    //     }
    //     echo "}".PHP_EOL;
    //     return;
    // }

}
