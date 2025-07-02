<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetInstance extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'asset_id',
        'organization_id',
        'infrastructure_id',
        'installed_at',
        'status',
        'asset_photo',
        'asset_serial_number_photo',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class, 'asset_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function infrastructure()
    {
        return $this->belongsTo(Infrastructure::class, 'infrastructure_id');
    }
}
