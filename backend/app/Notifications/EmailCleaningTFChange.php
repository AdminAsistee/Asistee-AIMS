<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EmailCleaningTFChange extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($cleaning)
    {
        $this->cleaning = $cleaning;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
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
        $cleaner = $this->cleaning->cleaner;
        return (new MailMessage)
            ->greeting( 'Hello ' . (is_null($cleaner) ? '[CLEANER NOT SET]' : $cleaner->name) )
            ->line( 'This is an email to notify you that your assigned Open cleaning on [' . $this->cleaning->cleaning_date . '] at [' . $this->cleaning->location->building_name . ' ' . $this->cleaning->location->room_number . '] has gotten a new booking and has become a TF Cleaning.')
            ->line( 'If you are unable to make this new arrangement, please contact your cleaning supervisor.' )
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
