<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        'App\Console\Commands\DrawBookings',
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $now = date("Y-m-d_H:i:s")
        $schedule->command('booking:draw 0')
        ->hourly()
        ->sendOutputTo(storage_path("AIMS_LARAVEL_TASK.out"))
        ->emailOutputTo('Tyler@Asistee.com');
        //->twiceDaily(6, 19)
        //->sendOutputTo($filePath);
        //->hourly();
        //->everyTenMinutes();
        //->everyMinute()
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
