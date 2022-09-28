<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Rate;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use function MongoDB\BSON\toJSON;

class ProductController extends Controller
{
    use GeneralTrait;
    public $i = 0;

    public function __construct() {
        $this->middleware('jwt:user-api', ['only' => ['createProduct']]);
    }

    public function getProducts(Request $request) {
        if($request->category === "ALL") {
            if($request->trader === "ALL") {
                if ($request->pagination === 0) {
                    return Product::orderBy('created_at', $request->order)->all();
                } else {
                    return Product::orderBy('created_at', $request->order)->paginate($request->pagination);
                }
            } else {
                if ($request->pagination === 0) {
                    return Product::where('trader', $request->trader)->orderBY('created_at', $request->order);
                } else {
                    return Product::where('trader', $request->trader)->orderBY('created_at', $request->order)->paginate($request->pagination);
                }
            }
        } else {
            if($request->trader === "ALL") {
                if($request->pagination === 0) {
                    return Product::where('category', $request->category)->orderBy('created_at', $request->order);
                } else {
                    return Product::where('category', $request->cateogry)->orderBy('created_at', $request->order)->paginate($request->pagination);
                }
            } else {
                if($request->pagination === 0) {
                    return Product::where(['category', 'trader'], [$request->category, $request->trader])->orderBy('created_at', $request->order);
                } else {
                    return Product::where(['category', 'trader'], [$request->category, $request->trader])->orderBy('created_at', $request->order)->paginate($request->pagination);
                }
            }
        }
    }

    public function getCategoryProducts(Request $request, $id, $first_loop = true) {
        $products = [];
        $brands = [];
        $category_products_collection = Product::where('category', $id)->get();

        $category_products = collect($category_products_collection)->toArray();
        for($i = 0; $i < count($category_products); $i++) {
            $category_products[$i]['trader_name'] = User::find($category_products[$i]['trader'])->name;
        }

        if(count($category_products) !== 0) {
            array_push($products, ...$category_products);
        }

        $subCategories = collect(Category::where('parent_group', $id)->get())->toArray();

        for($i = 0; $i < count($subCategories); $i++) {
            $category_id = $subCategories[$i]['id'];
            $subgroup_products = $this->getCategoryProducts(new Request(), $category_id, false);
            if($subgroup_products !== []) {
                array_push($products, ...$subgroup_products);
            }
        }

        if($first_loop) {
            $return_brands = [];
            $min_price = 100000;
            $max_price = 0;
            foreach ($products as $key=>$product) {
                $deleted = false;

                $products[$key]['rate'] = $this->getProductRate($product['id']);
                $products[$key]['rates'] = count(collect(Product::find($product['id'])->rates)->toArray());
                if(!in_array([
                    'id' => $product['brand_id'],
                    'name' => Brand::find($product['brand_id'])['name']
                ], $return_brands)) {
                    array_push($return_brands, [
                        'id' => $product['brand_id'],
                        'name' => Brand::find($product['brand_id'])['name']
                    ]);
                }
                if($request->checked_brands !== 'ALL') {
                    if(!in_array($product['brand_id'], explode(',', $request->checked_brands))) {
                        unset($products[$key]);
                        $deleted = true;
                    }
                }
                if(!$deleted) {
                    if ($product['price'] < $min_price)
                        $min_price = $product['price'];
                    if ($product['price'] > $max_price)
                        $max_price = $product['price'];
                    if ($request->price !== 'ALL') {
                        if (!((number_format(explode(':', $request->price)[0]) <= $product['price']) && ($product['price'] <= number_format(explode(':', $request->price)[1])))) {
                            unset($products[$key]);
                            $deleted = true;
                        }
                    }
                }
                if(!$deleted) {
                    if ($request->price !== 'ALL') {
                        if (!((number_format(explode(':', $request->price)[0]) <= $product['price']) && ($product['price'] <= number_format(explode(':', $request->price)[1])))) {
                            unset($products[$key]);
                            $deleted = true;
                        }
                    }
                }
                if(!$deleted) {
                    if($request->rate !== 'ALL') {
                        if ($products[$key]['rate'] < $request->rate) {
                            unset($products[$key]);
                            $deleted = true;
                        }
                    }
                }
            }
            return response()->json([
                'products' => $this->paginate($products, $request->pagination),
                'brands' => $return_brands,
                'min_price' => $min_price,
                'max_price' => $max_price
            ]);
        }
        return $products;
    }

    public function getProduct($id) {
        $product = Product::find($id);
        $product->trader = $product->trader();
        $product->category = $product->category();
        $product->brand = $product->brand();

        return $this->returnData('product', $product);
    }

    public function getProductRate($id) {
        $rates = collect(Product::find($id)->rates)->toArray();
        $sum_rate = 0;

        if(count($rates) === 0) {
            return 0;
        } else {
            for($i = 0; $i < count($rates); $i++) {
                $sum_rate += $rates[$i]['rate'];
            }

            return $sum_rate / count($rates);
        }
    }

    public function createProduct(Request $request) {

       // return $this->returnData('photos', ($request->get('photos')));

        try {

            $product = new Product();
            $product->name = $request->name;
            $product->trader = auth()->guard('user-api')->user()->id;
            $product->category = $request->category;
            $product->brand_id = $request->brand;
            $product->price = $request->price;
            $product->quantity = $request->quantity;
            $product->location = $request->location;
            $product->description = $request->description;
            $product->photos = "dd";

            $data = [];
            if ($request->get('photos')) {

                foreach($request->get('photos') as $image) {
                    $name = $request->name . '-image-' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
                    \Image::make($image)->save(public_path('images/') . $name);
                    array_push($data, $name);

                    $image->move(public_path('product_images/' . $product->id, $imageName));
                    $product->photo = $product->photo . $imageName . ',';
                    return("ff");
                }
            }
            $image = json_encode($data);

            $product->save();
            

            return $this->returnData('product', $product);
        } catch (\Exception $error) {
            return $error;
            return $this->returnError('E001', 'there is some error');
        }
    }

    public function updateProduct(Request $request) {
        $product = Product::find($request->id);
        $product->name = $request->name;
        $product->parent_group = $request->parentGroup;
        $product->save();

        return $this->returnData("category", $product);
    }

    public function deleteProduct($id) {
        $product = Product::find($id);
        $product->delete();

        return $this->returnSuccessMessage("Successfully deleted");
    }
}
