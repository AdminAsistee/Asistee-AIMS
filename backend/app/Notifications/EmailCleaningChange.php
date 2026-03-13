<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EmailCleaningChange extends Notification{
    use Queueable;
    public $cleaning;
    public $original_date;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct( $cleaning , $original_date){
        $this->cleaning = $cleaning;
        $this->original_date = $original_date;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable){
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->greeting( 'Hello ' . $this->cleaning->cleaner->name )
            ->line( 'This is an email to notify you that your assigned cleaning on [' . $this->original_date . '] at [' . $this->cleaning->location->building_name . ' ' . $this->cleaning->location->room_number . '] has been moved to the following date: ' . $this->cleaning->cleaning_date . '.')
            ->line( 'If you are unable to make this arrangement, please contact your cleaning supervisor.' )
            ->line( 'Thank you for being a dedicated member of Asistee\'s cleaning staff!' );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
