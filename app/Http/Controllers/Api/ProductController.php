<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use function MongoDB\BSON\toJSON;

class ProductController extends Controller
{
    use GeneralTrait;
    public $i = 0;

    public function __construct() {
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

    public function getCategoryProducts($id, $pagination) {
        $paginate = $pagination;
        $products = [];
        $category_products = collect(Product::where('category', $id)->paginate($paginate))->toArray()['data'];
        for($i = 0; $i < count($category_products); $i++) {
            $category_products[$i]['trader_name'] = User::find($category_products[$i]['trader'])->name;
        }

        if(count($category_products) !== 0) {
            array_push($products, ...$category_products);
        }

        $paginate = $pagination - count($category_products);

        if($paginate === 0) {
            return [$products, $paginate];
        }

        $subCategories = collect(Category::where('parent_group', $id)->get())->toArray();

        for($i = 0; $i < count($subCategories); $i++) {
            $category_id = $subCategories[$i]['id'];
            $response = $this->getCategoryProducts($category_id, $paginate);
            $subgroup_products = $response[0];
            $paginate = $response[1];

            $myfile = fopen("newfile.text", "a") or die("Unable to open file!");
            fwrite($myfile, $subCategories[$i]['name'] . ":");
            $products_text = json_encode($subgroup_products);
            fwrite($myfile, $products_text);
            fclose($myfile);

            if($subgroup_products !== []) {
                array_push($products, ...$subgroup_products);
            }
            if($paginate === 0) {
                return [$products, $paginate];
            }
        }

        return [$products, $paginate];
    }

    public function getProduct($id) {
        $product = Product::find($id);

        return $this->returnData('product', $product);
    }

    public function addCategory(Request $request) {
        try {
            $product = new Product();
            $product->name = $request->name;
            $product->trader = $request->trader;
            $product->category = $request->category;
            $product->price = $request->price;
            $product->quantity = $request->quantity;
            $product->save();

            return $this->returnData('product', product);
        } catch (\Exception $error) {
            return $error;
            return $this->returnError('E001', 'there is some error');
        }
    }

    public function updateCategory(Request $request) {
        $product = Product::find($request->id);
        $product->name = $request->name;
        $product->parent_group = $request->parentGroup;
        $product->save();

        return $this->returnData("category", $product);
    }

    public function deleteCategory($id) {
        $product = Product::find($id);
        $product->delete();

        return $this->returnSuccessMessage("Successfully deleted");
    }
}
