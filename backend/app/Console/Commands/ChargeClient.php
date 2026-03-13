<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;

class ChargeClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:charge {user} {amount}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'create a stripe charge to a client user.';

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
    {
        // get the user and amount arguments
        $user_id = $this->argument('user');
        $charge_amount = (int) $this->argument('amount');

        // Verify User exists, is client, and has card.
        $user = User::findOrFail($user_id);
        if($user->type != 'client'){
            $this->error('The entered user is not a client. Gracefully Failing.');
            return false;
        }
        if(is_null($user->stripe_id)){
            $this->error('The entered client does not have a registered stripe account. Gracefully Failing.');
            return false;
        }
        //verify Charge is a number, is positive, and is not excessively large.
        if(is_nan($charge_amount)){
            $this->error('The charge amount entered is NAN. Gracefully Failing.');
            return false;
        }
        if($charge_amount <= 0){
            $this->error('The charge amount entered is Negative or zero. Gracefully Failing.');
            return false;
        }
        if($charge_amount >= 10000000){
            $this->error('The charge amount entered is A little high. Don\'t you think a bank transfer would be more appropriate? Gracefully Failing.');
            return false;
        }
        //Charge user the amount
        $results = $user->charge($charge_amount);
        //output results to file
        $carbon = \Carbon\Carbon::now();
        $payment_output_file_location = "/log/PaymentLog/";
        $random_string = substr(md5(rand()), 0, 5);
        \Storage::disk('local')->put($payment_output_file_location . $carbon->format('Y-m-d_h:i:s') . "_" . $user_id . ":" . $random_string, $results);
        // output results to user
        $this->line($results . PHP_EOL);
        

    }
}
