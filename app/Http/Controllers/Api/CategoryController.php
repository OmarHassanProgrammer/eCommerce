<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use GeneralTrait;

    public function __construct() {
    }

    public function getCategories(Request $request) {
        if($request->parentGroup === "ALL") {
            if($request->pagination === 0) {
                return Category::all();
            } else {
                return Category::paginate($request->pagination);
            }
        } else {
            if($request->pagination === 0) {
                return Category::where('parent_group', $request->parentGroup)->orderBy('created_at', 'desc');
            } else {
                return Category::where('parent_group', $request->parentGroup)->orderBy('created_at', 'desc')->paginate($request->pagination);
            }
        }
    }

    public function getCategory($id) {
        $category = Category::find($id);

        return $this->returnData('category', $category);
    }

    public function addCategory(Request $request) {
        try {
            $category = new Category();
            $category->name = $request->name;
            $category->parent_group = $request->parentGroup;
            $category->save();

            return $this->returnData('category', $category);
        } catch (\Exception $error) {
            return $error;
            return $this->returnError('E001', 'there is some error');
        }
    }

    public function updateCategory(Request $request) {
        $category = Category::find($request->id);
        $category->name = $request->name;
        $category->parent_group = $request->parentGroup;
        $category->save();

        return $this->returnData("category", $category);
    }

    public function deleteCategory($id) {
        $category = Category::find($id);
        $category->delete();

        return $this->returnSuccessMessage("Successfully deleted");
    }
}
