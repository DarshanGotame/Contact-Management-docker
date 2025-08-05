import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { Contact, Category } from "../../models";
import { getQualifiedImageUrl } from "../../utils/helper";
import fs from "fs";
import path from "path";

export const updateContactImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError({
        status: 400,
        message: "Contact ID is required",
      });
    }

    if (!req.file) {
      throw new ApiError({
        status: 400,
        message: "Image file is required",
      });
    }

    // Find the contact and ensure it belongs to the authenticated user
    const contact = await Contact.findOne({
      where: {
        id: parseInt(id),
        userId: req.user.id!,
      },
    });

    if (!contact) {
      throw new ApiError({
        status: 404,
        message: "Contact not found",
      });
    }

    // Delete old avatar if it exists
    if (contact.avatar) {
      // Handle both old format (just filename) and new format (contact_images/filename)
      const oldFileName = contact.avatar.includes('/') 
        ? contact.avatar.split('/').pop() 
        : contact.avatar;
      const oldAvatarPath = path.join(process.cwd(), 'uploads', 'contact_images', oldFileName!);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update the contact with new avatar
    const avatarPath = `contact_images/${req.file.filename}`;
    await contact.update({ avatar: avatarPath });

    // Fetch the updated contact with associations
    const updatedContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    // Format the response data
    const responseData = {
      ...updatedContact!.toJSON(),
      avatar: getQualifiedImageUrl(updatedContact!.avatar),
    };

    new ApiResponse({
      status: 200,
      message: "Contact image updated successfully",
      data: responseData,
    }).send(res);
  } catch (error) {
    // If file was uploaded but error occurred, clean it up
    if (req.file) {
      const uploadedFilePath = path.join(process.cwd(), 'uploads', 'contact_images', req.file.filename);
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to update contact image",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
