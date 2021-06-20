<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use GeneralTrait;

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

    public function getCategoryProducts($id) {
        $products = [];
        array_push($products, collect(Product::where('category', $id))->toArray());

        $subCategories = Category::where('parent_group', $id);
        for($i = 1; $i <= collect($subCategories)->toArray(); $i++) {
            array_push($products, $this->getCategoryProducts(collect($subCategories)->toArray()[$i]->id));
        }

        return $products;
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
